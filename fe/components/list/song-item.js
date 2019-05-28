import { html } from '../../js_modules/lit-html.js';
import { AsyncComponent } from '../../lib/component.js';
import { store, updateStore } from '../../models/index.js';
import { secondToMinute } from '../../utils/datetime.js';
import AppMenu from '../menu/index.js';
import { del } from '../../services/song.js';
import Modal from '../modal/index.js';
import Confirm from '../confirm/index.js';
import mediaQuery from '../../lib/mediaquery.js';
import getSongEditModal from '../modals/song-edit.js';
import { addSong, removeSong } from '../../services/playlist.js';
import { songMap, playlistMap } from '../../models/data-map.js';

customElements.define(
  'song-list-item',
  class extends AsyncComponent {
    static get observedAttributes() {
      return ['id', 'updatedat'];
    }

    constructor() {
      super();
      this.onclick = this.clickHandle.bind(this);
      this.openMenuHandle = this.openMenuHandle.bind(this);
      this.editHandle = this.editHandle.bind(this);
      this.deleteHandle = this.deleteHandle.bind(this);
      this.addToPlaylist = this.addToPlaylist.bind(this);
    }

    clickHandle() {
      updateStore('playerState', {
        currentSong: Number(this.id),
        state: 'playing',
      });
    }

    async addToPlaylist() {
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
    }

    removeFromPlaylist(id) {
      removeSong(id, Number(this.id));
    }

    openMenuHandle(event) {
      this.classList.add('hover');
      const { pathname, search } = window.location;
      const query = new URLSearchParams(search);
      const playlistId = pathname === '/playlist' && query.get('id');
      AppMenu.open({
        list: [
          {
            text: 'edit',
            handle: this.editHandle,
          },
          {
            text: 'delete',
            handle: this.deleteHandle,
          },
          {
            text: playlistId ? 'remove from playlist' : 'add to playlist',
            handle: playlistId
              ? this.removeFromPlaylist.bind(this, playlistId)
              : this.addToPlaylist,
          },
        ],
        target: event.currentTarget,
        stage: mediaQuery.isPhone ? document.body : this.getRootNode().host,
        onclose: () => this.classList.remove('hover'),
      });
      event.stopPropagation();
    }

    editHandle() {
      Modal.open(getSongEditModal(songMap.get(Number(this.id))));
    }

    deleteHandle() {
      Confirm.open({
        complete: 'confirm',
        cancel: 'cancel',
        text: 'delete song?',
        oncomplete: () => del(Number(this.id)),
      });
    }

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
