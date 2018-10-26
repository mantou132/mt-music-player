import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import mediaQuery from '../../lib/mediaquery.js';
import { get as getAllSong, getFavorite } from '../../services/song.js';
import { get as getAllPlaylist, getSong } from '../../services/playlist.js';

customElements.define(
  'app-router',
  class extends Component {
    constructor() {
      super();
      this.state = store.historyState;
    }

    render() {
      const { pathname, search } = window.location;
      const query = new URLSearchParams(search);

      let content;
      let action;
      switch (pathname) {
        case '/':
        case '/songs':
          content = html`
            <app-song-list
            .getData="${getAllSong}"
            .data="${store.songData}">
          </app-song-list>`;
          action = html`
            <app-action
              .actions="${['menu', 'title', 'upload', 'search']}">
            </app-action>`;
          break;
        case '/playlist':
          content = html`
            <app-song-list
              id="${query.get('id')}"
              .getData="${() => getSong(query.get('id'))}"
              .data="${store.playlistData}">
            </app-song-list>`;
          action = html`
            <app-action
              .actions="${['menu', 'title', 'upload', 'search']}">
            </app-action>`;
          break;
        case '/favorites':
          content = html`
            <app-song-list
              .getData="${getFavorite}"
              .data="${store.favoriteData}">
            </app-song-list>`;
          action = html`
            <app-action
              .actions="${['menu', 'title', 'upload', 'search']}">
            </app-action>`;
          break;
        case '/search':
          content = html`
            <app-song-list
              .data="${store.searchData}">
            </app-song-list>`;
          action = html`
            <app-action
              .actions="${['back', 'searchInput']}">
            </app-action>`;
          break;
        case '/albums':
          content = html`<app-album-list></app-album-list>`;
          action = html`
            <app-action
              .actions="${['menu', 'title', 'upload', 'search']}">
            </app-action>`;
          break;
        case '/artists':
          content = html`<app-artist-list></app-artist-list>`;
          action = html`
            <app-action
              .actions="${['menu', 'title', 'upload', 'search']}">
            </app-action>`;
          break;
        case '/playlists':
          content = html`
            <app-playlist-list
              .getData="${getAllPlaylist}"
              .data="${store.playlistData}">
            </app-playlist-list>`;
          action = html`
            <app-action
              .actions="${['menu', 'title', 'upload', 'search']}">
            </app-action>`;
          break;
        default:
          content = html`<app-notfound></app-notfound>`;
          action = html`
            <app-action
              .actions="${mediaQuery.isPhone ? ['menu', 'title'] : []}">
            </app-action>`;
      }
      return html`
        <style>
          :host {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            padding: var(--list-padding) var(--list-padding) 0 calc(var(--drawer-width) + var(--list-padding));
            background: linear-gradient(to top, var(--list-background-color), var(--list-background-light-color));
            color: var(--list-text-primary-color);
            fill: var(--list-text-primary-color);
            overflow: auto;
          }

          :host::after {
            content: '';
            display: block;
            height: var(--list-padding);
            flex-shrink: 0;
          }

          .wrap {
            flex-shrink: 0;
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            width: 100%;
            max-width: 86rem;
            margin: 0 auto;
            box-sizing: border-box;
          }
          @media ${mediaQuery.PHONE_LANDSCAPE}, ${mediaQuery.PHONE}, ${mediaQuery.TABLET} {
            :host {
              padding: var(--list-padding) var(--list-padding) 0;
            }
            :host::-webkit-scrollbar {
              width: 0;
            }
            :host {
              scrollbar-width: none;
            }
          }
        </style>
        <div class="wrap">
          ${action}
          ${content}
        </div>
      `;
    }
  },
);
