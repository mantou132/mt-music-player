import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';
import './item.js';
import '../action/index.js';
import { store } from '../../models/index.js';
import AppUpload from '../upload/index.js';

customElements.define(
  'app-list',
  class AppList extends Component {
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
          app-action,
          list-item {
            padding: 1.6rem;
          }
          app-action app-icon {
            margin-right: 1.6rem;
          }
        </style>
        <div class="wrap">
          <app-action>
            <app-icon @click="${AppList.upload}" slot="1" name="add"></app-icon>
            <app-icon slot="2" name="search"></app-icon>
          </app-action>
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

    static upload() {
      AppUpload.instance.click();
    }
  },
);
