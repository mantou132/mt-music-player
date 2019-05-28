import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import { get } from '../../services/song.js';
import mediaSession from './mediasession.js';
import { getSrc } from '../../utils/misc.js';
import mediaQuery from '../../lib/mediaquery.js';
import { songMap } from '../../models/data-map.js';

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
      this.audio.onerror = this.playError.bind(this);
      this.audio.onplaying = this.playSuccess.bind(this);
      this.audio.onabort = this.playSuccess.bind(this); // Enter the waiting stage
      this.setCurrentTime();

      this.randomPlay = this.randomPlay.bind(this);
      this.nextPlay = this.nextPlay.bind(this);
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
        playerState: { currentSong: list[randomIndex] },
      });
    }

    nextPlay() {
      const {
        playerState: { currentSong },
      } = this.state;
      const { list } = store.songData;
      const currentIndex = list.findIndex(songId => songId === currentSong);
      let nextIndex;
      if (currentIndex === list.length - 1) {
        nextIndex = 0;
      } else {
        nextIndex = currentIndex + 1;
      }

      this.setState({
        playerState: { state: 'playing', currentSong: list[nextIndex] },
      });
    }

    playSuccess() {
      const {
        playerState: { currentSong, errorList, state },
      } = this.state;

      const index = errorList.indexOf(currentSong);
      const isError = index > -1;
      const isPlayingState = state === 'playing';
      if (isError) errorList.splice(index, 1);
      if (isError || !isPlayingState) {
        this.setState({
          playerState: { errorList, state: 'playing' },
        });
      }
    }

    playError() {
      const {
        playerState: { currentSong, errorList, state },
      } = this.state;

      const isError = errorList.includes(currentSong);
      const isErrorState = state === 'error';
      if (!isError) errorList.push(currentSong);
      if (!isError || !isErrorState) {
        this.setState({
          playerState: { errorList, state: 'error' },
        });
      }
    }

    render() {
      const {
        playerState: { currentSong, state, volume, muted },
        audioState: { currentTime },
      } = this.state;
      const song = songMap.get(currentSong);
      if (!('id' in song)) return;

      // switch mute
      if (muted !== this.audio.muted) {
        this.audio.muted = muted;
      }
      // Change volume
      if (!mediaQuery.isPhone && volume !== this.audio.volume) {
        this.audio.volume = volume;
      }
      // Adjust playback position
      if (Math.abs(currentTime - this.audio.currentTime) > 1.2) {
        this.audio.currentTime = currentTime;
      }
      // Change track
      if (song.id !== Number(this.id)) {
        this.id = song.id;
        this.audio.src = getSrc(song.src);
        this.setState({
          audioState: { currentTime: 0 },
        });
        mediaSession.setMetadata(song);
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
