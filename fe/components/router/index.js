import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import history from '../../lib/history.js';
import mediaQuery from '../../lib/mediaquery.js';
import { store } from '../../models/index.js';
import { getFavorite } from '../../services/song.js';
import { get as getAllPlaylist, getSong } from '../../services/playlist.js';
import { get as getAllAlbum } from '../../services/album.js';
import { get as getAllArtist } from '../../services/artist.js';
import AppAction from '../action/index.js';
import routeMap from './map.js';

customElements.define(
  'app-router',
  class extends Component {
    static observedStores = [history.historyState];

    href = window.location.href;

    shouldUpdate() {
      const { href } = window.location;
      if (href !== this.href) {
        this.scrollTop = 0;
        this.href = href;
        return true;
      }
      return false;
    }

    render() {
      const { pathname, search } = window.location;
      const query = new URLSearchParams(search);
      const filtername = query.has(routeMap.ARTISTS.subTitle)
        ? routeMap.ARTISTS.subTitle
        : query.has(routeMap.ALBUMS.subTitle) && routeMap.ALBUMS.subTitle;
      const filtervalue = query.get(filtername);

      let content;
      let action;
      switch (pathname) {
        case routeMap.HOME.path:
        case routeMap.SONGS.path:
          content = html`
            <app-song-list
              filtername="${filtername || ''}"
              filtervalue="${filtervalue}"
              .data="${store.songData}"
            >
            </app-song-list>
          `;
          action = html`
            <app-action
              .actions="${[
                AppAction.MENU,
                AppAction.TITLE,
                AppAction.UPLOAD,
                AppAction.SEARCH,
              ]}"
            >
            </app-action>
          `;
          break;
        case routeMap.PLAYLIST.path:
          content = html`
            <app-song-list
              id="${query.get('id')}"
              .fetchData="${() => getSong(query.get('id'))}"
              .data="${store.playlistData}"
            >
            </app-song-list>
          `;
          action = html`
            <app-action
              .actions="${[
                AppAction.MENU,
                AppAction.TITLE,
                AppAction.UPLOAD,
                AppAction.SEARCH,
              ]}"
            >
            </app-action>
          `;
          break;
        case routeMap.FAVORITES.path:
          content = html`
            <app-song-list
              .fetchData="${getFavorite}"
              .data="${store.favoriteData}"
            >
            </app-song-list>
          `;
          action = html`
            <app-action
              .actions="${[
                AppAction.MENU,
                AppAction.TITLE,
                AppAction.UPLOAD,
                AppAction.SEARCH,
              ]}"
            >
            </app-action>
          `;
          break;
        case routeMap.SEARCH.path:
          content = html`
            <app-song-list .data="${store.searchData}"> </app-song-list>
          `;
          action = html`
            <app-action .actions="${[AppAction.BACK, AppAction.SEARCH_INPUT]}">
            </app-action>
          `;
          break;
        case routeMap.ALBUMS.path:
          content = html`
            <app-album-list
              .fetchData="${getAllAlbum}"
              .data="${store.albumData}"
            >
            </app-album-list>
          `;
          action = html`
            <app-action
              .actions="${[
                AppAction.MENU,
                AppAction.TITLE,
                AppAction.UPLOAD,
                AppAction.SEARCH,
              ]}"
            >
            </app-action>
          `;
          break;
        case routeMap.ARTISTS.path:
          content = html`
            <app-artist-list
              .fetchData="${getAllArtist}"
              .data="${store.artistData}"
            >
            </app-artist-list>
          `;
          action = html`
            <app-action
              .actions="${[
                AppAction.MENU,
                AppAction.TITLE,
                AppAction.UPLOAD,
                AppAction.SEARCH,
              ]}"
            >
            </app-action>
          `;
          break;
        case routeMap.PLAYLISTS.path:
          content = html`
            <app-playlist-list
              .fetchData="${getAllPlaylist}"
              .data="${store.playlistData}"
            >
            </app-playlist-list>
          `;
          action = html`
            <app-action
              .actions="${[
                AppAction.MENU,
                AppAction.TITLE,
                AppAction.ADD_PLAYLIST,
                AppAction.SEARCH,
              ]}"
            >
            </app-action>
          `;
          break;
        default:
          content = html`
            <app-notfound></app-notfound>
          `;
          action = html`
            <app-action
              .actions="${mediaQuery.isPhone
                ? [AppAction.MENU, AppAction.TITLE]
                : []}"
            >
            </app-action>
          `;
      }
      return html`
        <style>
          :host {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            padding: var(--list-padding) var(--list-padding) 0
              calc(var(--drawer-width) + var(--list-padding));
            background: linear-gradient(
              to top,
              var(--list-background-color),
              var(--list-background-light-color)
            );
            color: var(--list-text-primary-color);
            fill: var(--list-text-primary-color);
            overflow: auto;
            scrollbar-width: thin;
            scrollbar-color: var(--scrollbar-color) var(--scrollbar-track-color);
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
          @media ${mediaQuery.PHONE} {
            :host {
              margin-bottom: var(--player-height);
            }
          }
          @media ${mediaQuery.PHONE_LANDSCAPE},
            ${mediaQuery.PHONE},
            ${mediaQuery.TABLET} {
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
          ${action} ${content}
        </div>
      `;
    }
  },
);
