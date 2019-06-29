import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { store, updateStore } from '../../models/index.js';
import mediaSession from './mediasession.js';
import mediaQuery from '../../lib/mediaquery.js';

customElements.define(
  'player-control',
  class extends Component {
    static observedStores = [store.playerState];

    constructor() {
      super();

      mediaSession.onplay = this.clickPlayHandle;
      mediaSession.onpause = this.clickPlayHandle;
      mediaSession.onprevioustrack = this.clickPrevHandle;
      mediaSession.onnexttrack = this.clickNextHandle;
    }

    clickShuffleHandle = () => {
      const { shuffle } = store.playerState;
      updateStore(store.playerState, {
        shuffle: !shuffle,
      });
    };

    clickPrevHandle = () => {
      const { currentSong } = store.playerState;
      const { list } = store.songData;
      const currentIndex = list.findIndex(songId => songId === currentSong);
      let prevIndex;
      if (currentIndex === 0) {
        prevIndex = list.length - 1;
      } else {
        prevIndex = currentIndex - 1;
      }
      updateStore(store.playerState, { currentSong: list[prevIndex] });
    };

    clickPlayHandle = () => {
      const { state, currentSong } = store.playerState;
      updateStore(store.playerState, {
        currentSong: currentSong === null ? 0 : currentSong,
        state: state === 'paused' ? 'playing' : 'paused',
      });
    };

    clickNextHandle = () => {
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
        currentSong: list[nextIndex],
        state: 'playing',
      });
    };

    clickModeHandle = () => {
      const { mode } = store.playerState;
      updateStore(store.playerState, {
        mode: mode === 'repeat' ? 'repeat-one' : 'repeat',
      });
    };

    render() {
      const { state, shuffle, mode } = store.playerState;
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
