import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import mediaSession from './mediasession.js';
import mediaQuery from '../../lib/mediaquery.js';

customElements.define(
  'player-control',
  class extends Component {
    constructor() {
      super();
      console.log('control constructor');
      this.state = store.playerState;
      this.clickShuffleHandle = this.clickShuffleHandle.bind(this);
      this.clickPrevHandle = this.clickPrevHandle.bind(this);
      this.clickPlayHandle = this.clickPlayHandle.bind(this);
      this.clickNextHandle = this.clickNextHandle.bind(this);
      this.clickModeHandle = this.clickModeHandle.bind(this);

      mediaSession.onplay = this.clickPlayHandle;
      mediaSession.onpause = this.clickPlayHandle;
      mediaSession.onprevioustrack = this.clickPrevHandle;
      mediaSession.onnexttrack = this.clickNextHandle;
    }

    clickShuffleHandle() {
      this.setState({
        shuffle: !this.state.shuffle,
      });
    }

    clickPrevHandle() {
      const { currentSong } = this.state;
      const { list } = store.songData;
      const currentIndex = list.findIndex(data => data.id === currentSong);
      let prevIndex;
      if (currentIndex === 0) {
        prevIndex = list.length - 1;
      } else {
        prevIndex = currentIndex - 1;
      }
      this.setState({ currentSong: list[prevIndex].id });
    }

    clickPlayHandle() {
      const { state, currentSong } = this.state;
      this.setState({
        currentSong: currentSong === null ? 0 : currentSong,
        state: state === 'paused' ? 'playing' : 'paused',
      });
    }

    clickNextHandle() {
      const { currentSong } = this.state;
      const { list } = store.songData;
      const currentIndex = list.findIndex(data => data.id === currentSong);
      let nextIndex;
      if (currentIndex === list.length - 1) {
        nextIndex = 0;
      } else {
        nextIndex = currentIndex + 1;
      }
      this.setState({ currentSong: list[nextIndex].id, state: 'playing' });
    }

    clickModeHandle() {
      const { mode } = this.state;
      this.setState({ mode: mode === 'repeat' ? 'repeat-one' : 'repeat' });
    }

    render() {
      const { state, shuffle, mode } = this.state;
      return html`
        <style>
          :host {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 24.6rem;
            padding: 0 1.6rem;
          }
          app-icon.play {
            padding: 1.3rem;
            border: 2px solid;
            border-radius: 100%;
          }
          app-icon.edge {
            color: var(--player-text-secondary-color);
            fill: var(--player-text-secondary-color);
          }
          [error] {
            color: var(--theme-error-color);
            fill: var(--theme-error-color);
          }
          @media ${mediaQuery.PHONE} {
            :host(:not([maximize])) {
              width: auto;
              padding: 0;
            }
            :host(:not([maximize])) app-icon:not(.play) {
              display: none;
            }
            :host(:not([maximize])) app-icon.play {
              padding: 1.6rem;
              border: none;
            }
            :host([maximize]) {
              margin: 2.4rem auto;
            }
            :host([maximize]) app-icon.play {
              padding: 2rem;
            }
          }
          @media ${mediaQuery.WATCH} {
            :host {
              justify-content: space-evenly;
            }
            app-icon.edge {
              display: none;
            }
          }
        </style>

        <app-icon
          @click="${this.clickShuffleHandle}"
          class="edge"
          name="shuffle"
          style="opacity: ${shuffle ? 1 : 0.5}"
        >
          <app-ripple circle></app-ripple>
        </app-icon>
        <app-icon @click="${this.clickPrevHandle}" name="skip-previous">
          <app-ripple circle></app-ripple>
        </app-icon>
        <!-- TODO: animate -->
        <app-icon
          @click="${this.clickPlayHandle}"
          class="play"
          ?error="${state === 'error'}"
          name="${state === 'paused' ? 'play-arrow' : 'pause'}"
        >
          <app-ripple circle></app-ripple>
        </app-icon>
        <app-icon @click="${this.clickNextHandle}" name="skip-next">
          <app-ripple circle></app-ripple>
        </app-icon>
        <app-icon @click="${this.clickModeHandle}" class="edge" name="${mode}">
          <app-ripple circle></app-ripple>
        </app-icon>
      `;
    }
  },
);
