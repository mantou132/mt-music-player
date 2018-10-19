import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import './item.js';
import '../action/index.js';
import '../ripple/index.js';
import '../link/index.js';
import '../form/text.js';
import { store } from '../../models/index.js';
import AppUpload from '../upload/index.js';
import { search } from '../../services/song.js';

customElements.define(
  'app-list',
  class extends Component {
    constructor() {
      super();
      let data;
      switch (this.type) {
        case 'search':
          data = store.searchData;
          break;
        default:
          data = store.songData;
      }

      this.state = {
        playerState: store.playerState,
        songData: data,
      };
      this.clickHandle = this.clickHandle.bind(this);
      this.renderItem = this.renderItem.bind(this);
    }

    get type() {
      return this.getAttribute('type');
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
      const { list, text = '' } = this.state.songData;
      return html`
        <style>
          :host {
            background: linear-gradient(to top, var(--list-background-color), var(--list-background-light-color));
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
            <app-icon
              slot="1"
              ?hidden="${this.type === 'search'}"
              @click="${AppUpload.open}"
              name="add">
              <app-ripple circle scale="1.5"></app-ripple>
            </app-icon>
            <app-link slot="2" path="/search">
              <app-icon name="search">
                <app-ripple circle scale="1.5"></app-ripple>
              </app-icon>
            </app-link>
            <form-text
              slot="3"
              ?hidden="${this.type === 'song'}"
              value="${text}"
              autofocus
              @change="${({ detail }) => search(detail)}">
            </form-text>
          </app-action>
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
