import { html } from '../../js_modules/lit-html.js';
import { SingleInstanceComponent } from '../../lib/component.js';
import history from '../../lib/history.js';
import { store, updateStore } from '../../models/index.js';
import mediaQuery from '../../lib/mediaquery.js';
import { get } from '../../services/playlist.js';
import Modal from '../modal/index.js';
import getAddPlaylistModal from '../modals/add-playlist.js';
import routeMap from '../router/map.js';
import { playlistMap } from '../../models/data-map.js';

const menus = [
  // {
  //   path: '/',
  //   icon: 'queue-music',
  //   text: 'play queue',
  // },
  {
    path: routeMap.ALBUMS.path,
    icon: 'album',
    text: routeMap.ALBUMS.title,
  },
  {
    path: routeMap.ARTISTS.path,
    icon: 'person',
    text: routeMap.ARTISTS.title,
  },
  {
    path: routeMap.SONGS.path,
    icon: 'music-note',
    text: routeMap.SONGS.title,
  },
  {
    path: routeMap.FAVORITES.path,
    icon: 'star',
    text: routeMap.FAVORITES.title,
  },
  {
    path: routeMap.PLAYLISTS.path,
    icon: 'playlist-play',
    text: routeMap.PLAYLISTS.title,
  },
];

export default class Drawer extends SingleInstanceComponent {
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
          <app-ripple type="${mediaQuery.isPhone ? 'touch' : ''}"></app-ripple>
        </app-link>
      </li>
    `;
  }

  static renderPlaylist(id) {
    const { title } = playlistMap.get(id);
    return html`
      <li>
        <app-link
          path="${routeMap.PLAYLIST.path}"
          query="?id=${id}"
          title="${title}"
        >
          <span>${title || '<empty name>'}</span>
          <app-ripple type="${mediaQuery.isPhone ? 'touch' : ''}"></app-ripple>
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
          box-sizing: border-box;
          height: 100%;
          padding-bottom: env(safe-area-inset-bottom);
        }
        .user {
          position: relative;
          display: flex;
          align-items: center;
          padding: calc(4.8rem + env(safe-area-inset-top)) 2.4rem 2.4rem;
          background: var(--drawer-user-background-color);
          color: var(--drawer-user-text-color);
        }
        .avatar {
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
        .playlist {
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
        @media ${mediaQuery.DESKTOP} {
          .playlist {
            display: block;
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
          .avatar {
            margin: 0 0 1.6rem 0;
          }
          .default {
            font-weight: normal;
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
          <app-img
            class="avatar"
            data-alt="avatar"
            data-src="${avatar}"
          ></app-img>
          <div>${name || 'Login'}</div>
        </div>
        <ol class="default">
          ${menus.map(Drawer.renderItem)}
        </ol>
        ${mediaQuery.isDesktop
          ? html`
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
            `
          : ''}
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
