import Component from '../../lib/component.js';
import { store, updateStore } from '../../models/index.js';
import { get } from '../../services/song.js';
import mediaSession from './mediasession.js';
import { getSrc } from '../../utils/misc.js';
import mediaQuery from '../../lib/mediaquery.js';
import { songMap } from '../../models/data-map.js';

customElements.define(
  'player-audio',
  class extends Component {
    static observedStores = [store.playerState, store.audioState];

    constructor() {
      super();
      this.audio = new Audio();
      this.audio.onended = this.endHandle.bind(this);
      this.audio.onerror = this.playError.bind(this);
      this.audio.onplaying = this.playSuccess.bind(this);
      this.audio.onabort = this.playSuccess.bind(this); // Enter the waiting stage
      this.audio.onplay = () => this.video && this.video.play();
      this.audio.onpause = () => this.video && this.video.pause();
      this.setCurrentTime();

      this.video = document.createElement('video');
      if (mediaQuery.isDesktop) {
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        this.video.hidden = true;
        this.video.muted = true;
        this.video.playsInline = true;
        this.video.srcObject = canvas.captureStream();
        this.video.play();
        const draw = () => {
          const { pip } = store.playerState;
          if (!pip) {
            ctx.rect(0, 0, 1, 1);
            ctx.fill();
          } else {
            const landscape = pip.naturalWidth > pip.naturalHeight;
            ctx.drawImage(
              pip,
              landscape ? (pip.naturalWidth - pip.naturalHeight) / 2 : 0,
              landscape ? 0 : -(pip.naturalWidth - pip.naturalHeight) / 2,
              landscape ? pip.naturalHeight : pip.naturalWidth,
              landscape ? pip.naturalHeight : pip.naturalWidth,
              0,
              0,
              300,
              300,
            );
          }
          setTimeout(draw, 80);
        };
        draw();
        this.video.addEventListener('leavepictureinpicture', () => {
          updateStore(store.playerState, { pip: null });
        });
      }
    }

    endHandle = () => {
      const { shuffle, mode } = store.playerState;
      if (shuffle) {
        this.randomPlay();
      } else if (mode === 'repeat') {
        this.nextPlay();
      } else {
        // repeat-one
        this.audio.play();
      }
    };

    randomPlay = () => {
      const { list } = store.songData;
      const randomIndex = Math.floor(Math.random() * list.length);
      updateStore(store.playerState, { currentSong: list[randomIndex] });
    };

    nextPlay = () => {
      const { currentSong } = store.playerState;
      const { list } = store.songData;
      const currentIndex = list.findIndex(songId => songId === currentSong);
      let nextIndex;
      if (currentIndex === list.length - 1) {
        nextIndex = 0;
      } else {
        nextIndex = currentIndex + 1;
      }

      updateStore(store.playerState, {
        state: 'playing',
        currentSong: list[nextIndex],
      });
    };

    playSuccess = () => {
      const { currentSong, errorList, state } = store.playerState;

      const index = errorList.indexOf(currentSong);
      const isError = index > -1;
      const isPlayingState = state === 'playing';
      if (isError) errorList.splice(index, 1);
      if (isError || !isPlayingState) {
        updateStore(store.playerState, { errorList, state: 'playing' });
      }
    };

    playError = () => {
      const { currentSong, errorList, state } = store.playerState;

      const isError = errorList.includes(currentSong);
      const isErrorState = state === 'error';
      if (!isError) errorList.push(currentSong);
      if (!isError || !isErrorState) {
        updateStore(store.playerState, { errorList, state: 'error' });
      }
    };

    enterPictureInPicture = () => {
      this.video.requestPictureInPicture().catch(error => {
        console.error(error);
        updateStore(store.playerState, { pip: null });
      });
    };

    render = () => {
      const { currentSong, state, volume, muted, pip } = store.playerState;
      const { currentTime } = store.audioState;
      const song = songMap.get(currentSong);
      if (!('id' in song)) return;

      if (document.pictureInPictureElement && !pip) {
        document.exitPictureInPicture();
      }
      if (!document.pictureInPictureElement && pip) {
        this.enterPictureInPicture();
      }

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
        updateStore(store.audioState, { currentTime: 0 });
        mediaSession.setMetadata(song);
      }
      // play
      if (state === 'playing' && this.audio.paused) {
        this.audio.play();
        this.video.play();
      }
      // pause
      if (state === 'paused' && !this.audio.paused) {
        this.audio.pause();
        this.video.pause();
      }
    };

    setCurrentTime = () => {
      setInterval(() => {
        const { duration } = store.audioState;
        if (!this.audio.paused && !this.audio.error) {
          updateStore(store.audioState, {
            currentTime: this.audio.duration ? this.audio.currentTime : 0,
            duration: this.audio.duration || duration,
          });
        }
      }, 1000);
    };

    async mounted() {
      const list = await get();
      if (list[0]) {
        updateStore(store.playerState, { currentSong: list[0].id });
      }
    }
  },
);
