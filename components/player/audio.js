import Component from '../index.js';
import { store } from '../../models/index.js';

customElements.define(
  'player-audio',
  class extends Component {
    constructor() {
      super();
      this.state = {
        playerState: store.playerState,
        audioState: store.audioState,
      };
      this.audio = new Audio();
      this.audio.onended = this.endHandle;
      this.audio.volume = store.playerState.volume;
      this.setCurrentTime();
    }

    endHandle() {
      const {
        playerState: { currentSong, shuffle, mode },
      } = this.state;
      const { list } = store.songData;
      if (shuffle) {
        const randomIndex = Math.floor(Math.random() * list.length);
        this.setState({
          playerState: { currentSong: list[randomIndex].id },
        });
      } else if (mode === 'repeat') {
        const currentIndex = list.findIndex(data => data.id === currentSong);
        let nextIndex;
        if (currentIndex === list.length - 1) {
          nextIndex = 0;
        } else {
          nextIndex = currentIndex + 1;
        }
        this.setState({
          playerState: { currentSong: list[nextIndex].id },
        });
      } else {
        this.audio.play();
      }
    }

    render() {
      const {
        playerState: {
          currentSong, state, volume, muted,
        },
        audioState: { currentTime },
      } = this.state;
      const { list } = store.songData;
      const song = list.find(data => data.id === currentSong);
      if (!song) return;

      // switch mute
      if (muted !== this.audio.muted) {
        this.audio.muted = muted;
      }
      // Change volume
      if (volume !== this.audio.volume) {
        this.audio.volume = volume;
      }
      // Adjust playback position
      if (Math.abs(currentTime - this.audio.currentTime) > 1.2) {
        this.audio.currentTime = currentTime;
        this.audio.play();
      }
      // Change track
      if (String(song.id) !== this.id) {
        this.id = song.id;
        this.audio.src = song.src;
        this.audio.play().catch(() => {
          this.setState({
            audioState: { state: 'error' },
          });
        });
        this.setState({
          audioState: { currentTime: 0 },
        });
      }
      // play
      if (state === 'playing' && this.audio.paused) {
        this.audio.play();
      }
      // pause
      if (state === 'paused' && !this.audio.paused) {
        this.audio.pause();
      }
    }

    setCurrentTime() {
      setInterval(() => {
        const {
          audioState: { duration },
        } = this.state;
        if (!this.audio.paused && !this.audio.error) {
          this.setState({
            audioState: {
              currentTime: this.audio.duration ? this.audio.currentTime : 0,
              duration: this.audio.duration || duration,
            },
          });
        }
      }, 1000);
    }
  },
);
