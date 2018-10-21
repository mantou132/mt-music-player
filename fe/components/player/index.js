import { html } from 'https://dev.jspm.io/lit-html';
import { store } from '../../models/index.js';
import Component from '../../lib/component.js';
import history from '../../lib/history.js';

import './song-info.js';
import './control.js';
import './volume.js';
import './progress.js';
import './audio.js';
import mediaQuery from '../../lib/mediaquery.js';

customElements.define(
  'app-player',
  class extends Component {
    constructor() {
      super();
      this.state = store.playerState;
      this.clickHandle = this.clickHandle.bind(this);
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

    render() {
      const { maximize } = this.state;

      return html`
        <style>
          :host {
            position: -webkit-sticky;
            position: sticky;
            bottom: 0;
            flex-shrink: 0;
            height: var(--player-height);
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
          app-icon {
            display: none;
          }
          @media ${mediaQuery.PHONE} {
            :host {
              border-top: none;
              transition: height .3s;
            }
            :host([maximize]) {
              position: fixed;
              flex-direction: column;
              justify-content: space-between;
              width: 100%;
              height: 100%;
            }
            :host([maximize]) player-song-info {
              width: auto;
              flex-grow: initial;
            }
            player-volume {
              display: none;
            }
            app-icon {
              display: block;
              padding: 1.6rem;
              margin-right: 1.6rem;
            }
          }
        </style>
        <player-audio hidden></player-audio>
        <app-icon
          @click="${this.clickHandle}"
          name="${maximize ? 'expand-more' : 'expand-less'}">
          <app-ripple circle></app-ripple>
        </app-icon>
        <player-song-info></player-song-info>
        <player-progress></player-progress>
        <player-control></player-control>
        <player-volume></player-volume>
    `;
    }
  },
);
