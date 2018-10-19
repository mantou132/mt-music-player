import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import { get } from '../../services/song.js';
import mediaSession from './mediasession.js';

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
      this.audio.onended = this.endHandle.bind(this);
      this.audio.volume = store.playerState.volume;
      this.setCurrentTime();

      this.randomPlay = this.randomPlay.bind(this);
      this.nextPlay = this.nextPlay.bind(this);
      this.playError = this.playError.bind(this);
      this.playSuccess = this.playSuccess.bind(this);
    }

    endHandle() {
      const {
        playerState: { shuffle, mode },
      } = this.state;
      if (shuffle) {
        this.randomPlay();
      } else if (mode === 'repeat') {
        this.nextPlay();
      } else {
        // repeat-one
        this.audio.play();
      }
    }

    randomPlay() {
      const { list } = store.songData;
      const randomIndex = Math.floor(Math.random() * list.length);
      this.setState({
        playerState: { currentSong: list[randomIndex].id },
      });
    }

    nextPlay() {
      const {
        playerState: { currentSong },
      } = this.state;
      const { list } = store.songData;
      const currentIndex = list.findIndex(data => data.id === currentSong);
      let nextIndex;
      if (currentIndex === list.length - 1) {
        nextIndex = 0;
      } else {
        nextIndex = currentIndex + 1;
      }

      this.setState({
        playerState: { state: 'playing', currentSong: list[nextIndex].id },
      });
    }

    playSuccess() {
      const {
        playerState: { currentSong, errorList },
      } = this.state;

      const index = errorList.indexOf(currentSong);
      if (index > -1) {
        errorList.splice(index, 1);
        this.setState({
          errorList,
        });
      }
    }

    playError() {
      const {
        playerState: { currentSong, errorList },
      } = this.state;

      if (!errorList.includes(currentSong)) errorList.push(currentSong);
      this.setState({
        errorList,
        playerState: { state: 'error' },
      });
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
      }
      // Change track
      if (String(song.id) !== this.id) {
        this.id = song.id;
        this.audio.src = song.src;
        this.setState({
          audioState: { currentTime: 0 },
        });
        mediaSession.setMetadata(song);
      }
      // play
      if (state === 'playing' && this.audio.paused) {
        this.audio
          .play()
          .then(this.playSuccess)
          .catch(this.playError);
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

    async connected() {
      const list = await get();
      if (list[0]) {
        this.setState({
          playerState: { currentSong: list[0].id },
        });
      }
    }
  },
);
