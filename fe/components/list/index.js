import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';

import './item.js';
import mediaQuery from '../../lib/mediaquery.js';

customElements.define(
  'app-list',
  class extends Component {
    constructor() {
      super();
      this.clickHandle = this.clickHandle.bind(this);
      this.renderItem = this.renderItem.bind(this);
    }

    clickHandle({ target }) {
      this.setState({
        playerState: {
          currentSong: Number(target.id),
          state: 'playing',
        },
      });
    }

    render() {
      if (!this.state) {
        // lit-html cannot be accessed in constructor
        this.state = {
          playerState: store.playerState,
          data: this.data || {},
        };
      }
      const { list = [] } = this.state.data;
      return html`
        <style>
          :host {
            background: linear-gradient(to top, var(--list-background-color), var(--list-background-light-color));
            color: var(--list-text-primary-color);
            fill: var(--list-text-primary-color);
          }
          .wrap {
            max-width: 86rem;
            margin: auto;
            padding: var(--list-padding);
          }
          list-item {
            padding: 1.6rem;
          }
          @media ${mediaQuery.PHONE} {
            :host::-webkit-scrollbar {
              width: 0;
            }
            :host {
              scrollbar-width: none;
            }
          }
        </style>
        <div class="wrap">
          <app-action .actions="${this.actions}"></app-action>
          ${list.map(this.renderItem)}
        </div>
    `;
    }

    renderItem(data) {
      const { errorList, currentSong, state } = this.state.playerState;
      const playIcon = state === 'paused' ? 'pause' : 'playing';
      const isError = errorList.includes(data.id);
      return html`
        <list-item
          id="${data.id}"
          updatedat="${data.updatedAt}"
          ?error="${isError}"
          ?active="${currentSong === data.id}"
          @click="${this.clickHandle}">
          <app-icon
            name="${playIcon}"
            ?hidden="${currentSong !== data.id || isError}">
          </app-icon>
        </list-item>
      `;
    }
  },
);
