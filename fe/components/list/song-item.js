import { html } from '../../js_modules/lit-html.js';
import { AsyncComponent } from '../../lib/component.js';
import history from '../../lib/history.js';
import { store, updateStore } from '../../models/index.js';
import { secondToMinute } from '../../utils/datetime.js';
import AppMenu from '../menu/index.js';
import routeMap from '../router/map.js';
import { del, update } from '../../services/song.js';
import Modal from '../modal/index.js';
import Confirm from '../confirm/index.js';
import mediaQuery from '../../lib/mediaquery.js';
import getSongEditModal from '../modals/song-edit.js';
import { addSong, removeSong } from '../../services/playlist.js';
import { songMap, playlistMap } from '../../models/data-map.js';

customElements.define(
  'song-list-item',
  class extends AsyncComponent {
    static observedAttributes = ['id', 'updatedat'];

    constructor() {
      super();
      this.onclick = this.clickHandle;
    }

    clickHandle = () => {
      updateStore(store.playerState, {
        currentSong: Number(this.id),
        state: 'playing',
      });
    };

    addToPlaylist = async () => {
      const songId = Number(this.id);
      const { list } = store.playlistData;
      AppMenu.open({
        type: 'center',
        list: list.map(playlistId => ({
          text: playlistMap.get(playlistId).title,
          handle() {
            addSong(playlistId, songId);
          },
        })),
      });
    };

    openMenuHandle = event => {
      this.classList.add('hover');
      const { path, query } = history.location;
      const actions = [
        {
          text: 'edit',
          handle: this.editHandle,
        },
        {
          text: 'delete',
          handle: this.deleteHandle,
        },
      ];
      const playlistId = path === routeMap.PLAYLIST.path && query.get('id');
      if (playlistId) {
        actions.push({
          text: 'remove from playlist',
          handle: () => removeSong(playlistId, Number(this.id)),
        });
      } else {
        actions.push({
          text: 'add to playlist',
          handle: this.addToPlaylist,
        });
      }
      if (path === routeMap.FAVORITES.path) {
        actions.push({
          text: 'remove from favorites',
          handle: () => update(Number(this.id), { star: 0 }),
        });
      }
      AppMenu.open({
        list: actions,
        target: event.currentTarget,
        stage: mediaQuery.isPhone ? document.body : this.getRootNode().host,
        onclose: () => this.classList.remove('hover'),
      });
      event.stopPropagation();
    };

    editHandle = () => {
      Modal.open(getSongEditModal(songMap.get(Number(this.id))));
    };

    deleteHandle = () => {
      Confirm.open({
        complete: 'confirm',
        cancel: 'cancel',
        text: 'delete song?',
        oncomplete: () => del(Number(this.id)),
      });
    };

    render() {
      const song = songMap.get(Number(this.id));
      return html`
        <style>
          :host {
            contain: content;
            position: relative;
            display: flex;
            padding: 1.6rem;
            transition: background-color 0.3s;
          }
          :host([active]) {
            --list-item-playing-color: var(--theme-color);
          }
          :host([error]) {
            --list-item-playing-color: var(--theme-error-color);
          }
          .info {
            flex-grow: 1;
            width: 0;
          }
          .title {
            color: var(--list-item-playing-color);
            fill: var(--list-item-playing-color);
          }
          ::slotted(app-icon:not([hidden])) {
            vertical-align: middle;
            margin: -0.6rem 0 -0.4rem -0.5rem;
          }
          .title,
          .name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .name {
            margin-top: 0.25em;
          }
          .name:blank {
            display: none;
          }
          .name,
          .duration {
            font-size: 0.875em;
            color: var(--list-text-secondary-color);
          }
          .more app-icon {
            margin-top: -0.2rem;
          }
          .more app-ripple {
            z-index: 1;
          }
          .more,
          .duration {
            min-width: 4rem;
            padding-left: 0.75rem;
            text-align: right;
          }
          .duration {
            padding-top: 0.125em;
            color: var(--list-item-playing-color);
          }

          @media ${mediaQuery.HOVER} {
            :host(:hover),
            :host(.hover) {
              background: var(--list-hover-background-color);
            }

            .more {
              display: none;
            }

            :host(:hover) .more,
            :host(.hover) .more {
              display: block;
            }
          }
          @media ${mediaQuery.PHONE} {
            .more app-ripple {
              transform: scale(2);
            }
          }
        </style>
        <div class="info">
          <div class="title">
            <slot></slot>
            ${song.title}
          </div>
          <div class="name">${song.artist || 'unknown'}</div>
        </div>
        <div class="more">
          <app-icon @click="${this.openMenuHandle}" name="more-horiz">
            <app-ripple circle></app-ripple>
          </app-icon>
        </div>
        <div class="duration">
          ${secondToMinute(song.duration)}
        </div>
        <app-ripple type="touch"></app-ripple>
      `;
    }
  },
);
