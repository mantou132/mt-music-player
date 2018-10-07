import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';
import './item.js';
import { store } from '../../models/index.js';

customElements.define(
  'app-list',
  class extends Component {
    constructor() {
      super();
      this.state = {
        playerState: store.playerState,
        songData: store.songData,
      };
      this.clickHandle = this.clickHandle.bind(this);
      this.renderItem = this.renderItem.bind(this);
    }

    render() {
      const { list } = this.state.songData;
      return html`
        <style>
          :host {
            background: var(--list-background-color);
            color: var(--list-text-primary-color);
            fill: var(--list-text-primary-color);
          }
          .wrap {
            max-width: 103.2rem;
            margin: auto;
            padding: 5.6rem;
          }
          app-icon:not([hidden]) {
            display: block;
          }
        </style>
        <div class="wrap">
          <app-actions></app-actions>
          ${list.map(this.renderItem)}
        </div>
    `;
    }

    renderItem(data) {
      const { currentSong, state } = this.state.playerState;
      const playIcon = state === 'paused' || state === 'error' ? 'pause' : 'play-arrow';
      return html`
        <list-item
          id="${data.id}"
          ?active="${currentSong === data.id}"
          @click="${this.clickHandle}">
          <app-icon name="${playIcon}" ?hidden="${currentSong !== data.id}"></app-icon>
        </list-item>
      `;
    }

    clickHandle({ target }) {
      this.setState({
        playerState: {
          currentSong: Number(target.id),
          state: 'playing',
        },
      });
    }
  },
);
