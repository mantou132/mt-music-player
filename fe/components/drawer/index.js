import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import history from '../../lib/history.js';
import { store, updateStore } from '../../models/index.js';
import mediaQuery from '../../lib/mediaquery.js';
import { getSrc } from '../../utils/misc.js';
import { transformTextToSVG } from '../../utils/canvas.js';
import { get } from '../../services/playlist.js';
import Modal from '../modal/index.js';
import getAddPlaylistModal from '../modals/add-playlist.js';

const menus = [
  // {
  //   path: '/',
  //   icon: 'queue-music',
  //   text: 'play queue',
  // },
  {
    path: '/albums',
    icon: 'album',
    text: 'albums',
  },
  {
    path: '/artists',
    icon: 'person',
    text: 'artists',
  },
  {
    path: '/',
    icon: 'music-note',
    text: 'songs',
  },
  {
    path: '/favorites',
    icon: 'star',
    text: 'favorites',
  },
  {
    path: '/playlists',
    icon: 'playlist-play',
    text: 'playlists',
  },
];

export default class Drawer extends Component {
  static open() {
    updateStore('drawerState', {
      isOpen: true,
    });
    history.push({
      path: window.location.pathname,
      query: window.location.search,
      close: Drawer.close,
    });
  }

  static close() {
    updateStore('drawerState', { isOpen: false });
  }

  static closeHandle() {
    Drawer.close();
    history.back();
  }

  static renderItem({ path, icon, text }) {
    return html`
      <li>
        <app-link path="${path}" title="${text}">
          <app-icon name="${icon}"></app-icon>
          <span>${text}</span>
          <app-ripple type="${mediaQuery.isPhone ? 'type' : ''}"></app-ripple>
        </app-link>
      </li>
    `;
  }

  static renderPlaylist({ id, title }) {
    return html`
      <li>
        <app-link path="${`/playlist?id=${id}`}" title="playlist">
          <span>${title}</span>
          <app-ripple type="${mediaQuery.isPhone ? 'type' : ''}"></app-ripple>
        </app-link>
      </li>
    `;
  }

  static addPlaylistHandle() {
    Modal.open(getAddPlaylistModal());
  }

  constructor() {
    super();
    this.state = {
      drawer: store.drawerState,
      user: store.userData,
      data: store.playlistData,
    };
  }

  get avatar() {
    const { name } = this.state.user;
    if (!this.$avatar) {
      this.$avatar = transformTextToSVG((name || 'Login').substr(0, 2));
    }
    return this.$avatar;
  }

  render() {
    const { name, avatar } = this.state.user;
    const { list } = this.state.data;

    return html`
      <style>
        :host {
          position: fixed;
          top: 0;
          left: 0;
          width: var(--drawer-width);
          height: calc(100% - var(--player-height));
          font-size: 1.4rem;
          background: var(--drawer-background-color);
          overflow: auto;
          scrollbar-width: thin;
          scrollbar-color: var(--scrollbar-color) var(--scrollbar-track-color);
        }
        .menu {
          height: 100%;
        }
        .user {
          position: relative;
          display: flex;
          align-items: center;
          padding: 4.8rem 2.4rem 2.4rem;
          background: var(--drawer-user-background-color);
          color: var(--drawer-user-text-color);
        }
        .user img {
          margin: 0 1.6rem 0 0;
          border-radius: 100%;
          width: 3.2rem;
        }
        ol {
          margin: 0;
          padding: 0;
          margin-bottom: 3.2rem;
          list-style: none;
          color: var(--drawer-text-secondary-color);
          fill: var(--drawer-text-secondary-color);
        }
        .default {
          font-weight: 700;
        }
        .default app-icon {
          display: none;
        }
        li {
          position: relative;
          display: flex;
          align-items: center;
          padding: 1.6rem 2.4rem;
          text-transform: capitalize;
        }
        li app-icon {
          margin-right: 1.6rem;
        }
        [active] {
          color: var(--theme-color);
          fill: var(--theme-color);
        }
        @media ${mediaQuery.HOVER} {
          app-link:hover:not([active]) {
            color: var(--drawer-text-primary-color);
          }
          li {
            cursor: pointer;
          }
        }
        @media ${mediaQuery.PHONE_LANDSCAPE},
          ${mediaQuery.PHONE},
          ${mediaQuery.TABLET} {
          :host {
            z-index: 9;
            left: -100%;
            right: 100%;
            width: 100%;
            height: 100%;
            transition-property: left;
            transition-delay: 0.2s;
            background: none;
            overflow: hidden;
          }
          .backdrop {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            opacity: 0;
            background: var(--theme-backdrop-color);
          }
          .menu {
            position: relative;
            width: var(--drawer-width);
            transform: translateX(-100%);
            background: var(--drawer-background-color);
            overflow: auto;
          }
          .menu::-webkit-scrollbar {
            width: 0;
          }
          .menu {
            scrollbar-width: none;
          }
          .menu,
          .backdrop {
            transition-duration: 0.2s;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
          }
          .user {
            flex-direction: column;
            align-items: flex-start;
            margin-bottom: 1.6rem;
          }
          .user img {
            margin: 0 0 1.6rem 0;
          }
          .default {
            font-weight: normal;
          }
          .playlist {
            display: none;
          }
          .default app-icon {
            display: block;
          }
          :host(.open) {
            left: 0;
            transition: none;
          }
          :host(.open) .menu {
            transform: translateX(0);
          }
          :host(.open) .backdrop {
            opacity: 1;
          }
          :host(.open) .menu,
          :host(.open) .backdrop {
            pointer-events: auto;
          }
        }
      </style>
      <div class="backdrop" @click="${Drawer.closeHandle}"></div>
      <div class="menu">
        <div class="user">
          <img src="${avatar ? getSrc(avatar) : this.avatar}" />
          <div>${name || 'Login'}</div>
        </div>
        <ol class="default">
          ${menus.map(Drawer.renderItem)}
        </ol>
        <ol class="playlist">
          ${list.map(Drawer.renderPlaylist)}
        </ol>
        <ol class="playlist">
          <li @click="${Drawer.addPlaylistHandle}">
            <app-icon name="playlist-add"></app-icon>
            <span>add playlisy</span>
            <app-ripple></app-ripple>
          </li>
        </ol>
      </div>
    `;
  }

  connected() {
    get();
  }

  updated() {
    const { isOpen } = this.state.drawer;
    if (isOpen) {
      this.classList.add('open');
    } else {
      this.classList.remove('open');
    }
  }
}

customElements.define('app-drawer', Drawer);
