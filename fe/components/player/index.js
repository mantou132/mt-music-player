import { html } from '../../js_modules/lit-html.js';
import { store } from '../../models/index.js';
import Component from '../../lib/component.js';
import history from '../../lib/history.js';
import mediaQuery from '../../lib/mediaquery.js';
import Modal from '../modal/index.js';
import routeMap from '../router/map.js';
import getSongEditModal from '../modals/song-edit.js';
import { songMap } from '../../models/data-map.js';

import './song-info.js';
import './control.js';
import './volume.js';
import './progress.js';
import './audio.js';

customElements.define(
  'app-player',
  class extends Component {
    constructor() {
      super();
      this.state = store.playerState;
      this.clickHandle = this.clickHandle.bind(this);
      this.editHandle = this.editHandle.bind(this);
      this.searchHandle = this.searchHandle.bind(this);
      this.close = this.close.bind(this);
    }

    close() {
      this.removeAttribute('maximize');
      this.setState({ maximize: false });
    }

    clickHandle() {
      const { pathname, search } = window.location;
      const { maximize } = this.state;

      if (maximize) {
        this.removeAttribute('maximize');
        this.setState({ maximize: false });
        history.back();
      } else {
        this.setAttribute('maximize', '');
        this.setState({ maximize: true });
        history.push({
          path: pathname,
          query: search,
          close: this.close,
        });
      }
    }

    editHandle() {
      const { currentSong } = this.state;
      const song = songMap.get(currentSong);
      Modal.open(getSongEditModal(song));
    }

    searchHandle() {
      this.clickHandle();
      setTimeout(() => {
        history.push({
          path: routeMap.SEARCH.path,
          close: () => setTimeout(this.clickHandle, 100),
        });
      }, 100);
    }

    render() {
      const { maximize } = this.state;

      return html`
        <style>
          :host {
            z-index: 5;
            contain: strict;
            position: -webkit-sticky;
            position: sticky;
            bottom: 0;
            flex-shrink: 0;
            height: var(--player-height);
            padding-bottom: env(safe-area-inset-bottom);
            box-sizing: border-box;
            display: flex;
            overflow: hidden;
            background: var(--player-background-color);
            border-top: 1px solid var(--player-separator-color);
            color: var(--player-text-primary-color);
            fill: var(--player-text-primary-color);
          }
          player-control {
            flex-shrink: 0;
          }
          player-song-info,
          player-volume {
            flex-shrink: 1;
            flex-grow: 1;
            width: 0;
          }
          .header {
            display: none;
          }
          @media ${mediaQuery.PHONE} {
            :host {
              position: fixed;
              width: 100%;
              transition: height 0.3s;
            }
            :host([maximize]) {
              flex-direction: column;
              justify-content: space-between;
              height: 100%;
              padding-top: env(safe-area-inset-top);
            }
            :host([maximize]) player-song-info {
              width: auto;
              flex-grow: initial;
            }
            .header {
              display: flex;
              align-items: center;
              flex-shrink: 0;
              justify-content: space-between;
              padding: 0.4rem;
            }
            :host(:not([maximize])) .header {
              margin-right: 1.6rem;
            }
            :host([maximize]) .nav {
              margin-right: auto;
            }
            :host(:not([maximize])) .action {
              display: none;
            }
            .header app-icon {
              padding: 1.2rem;
            }
          }
          @media ${mediaQuery.SMALL_PHONE} {
            :host([maximize]) player-song-info {
              flex-grow: 1;
            }
          }
          @media ${mediaQuery.MOTION_REDUCE} {
            :host {
              transition: none;
            }
          }
          @media ${mediaQuery.WATCH}, ${mediaQuery.PHONE}, ${mediaQuery.SHORT} {
            :host {
              border-top: none;
            }
            player-volume {
              display: none;
            }
          }
          @media ${mediaQuery.WATCH} {
            :host {
              position: fixed;
              flex-direction: column;
              justify-content: space-evenly;
              align-items: center;
              width: 100%;
              height: 100%;
            }
            player-song-info {
              width: 90%;
              flex-grow: initial;
              text-align: center;
            }
          }
        </style>
        <player-audio hidden></player-audio>
        <div class="header">
          <app-icon
            class="nav"
            @click="${this.clickHandle}"
            name="${maximize ? 'expand-more' : 'expand-less'}"
          >
            <app-ripple scale=".8" circle></app-ripple>
          </app-icon>
          <app-icon class="action" @click="${this.editHandle}" name="edit">
            <app-ripple scale=".8" circle></app-ripple>
          </app-icon>
          <app-icon class="action" @click="${this.searchHandle}" name="search">
            <app-ripple scale=".8" circle></app-ripple>
          </app-icon>
        </div>
        <player-song-info ?maximize="${maximize}"></player-song-info>
        <player-progress ?maximize="${maximize}"></player-progress>
        <player-control ?maximize="${maximize}"></player-control>
        <player-volume></player-volume>
      `;
    }
  },
);
