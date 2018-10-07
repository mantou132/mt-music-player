import Component from '../index.js';
import { store } from '../../models/index.js';

customElements.define(
  'player-audio',
  class extends Component {
    constructor() {
      super();
      this.state = store.playerState;
      this.audio = new Audio();
    }

    render() {
      // state change called
      const { currentSong, state } = this.state;
      const { list } = store.songData;
      const song = list.find(data => data.id === currentSong);
      if (!song) return;
      if (song.id !== Number(this.id)) {
        this.id = song.id;
        this.audio.src = song.src;
        this.audio.play().catch(() => {
          this.setState({
            state: 'error',
          });
        });
      }
      if (state === 'playing' && this.audio.paused) {
        this.audio.play();
      }
    }
  },
);
