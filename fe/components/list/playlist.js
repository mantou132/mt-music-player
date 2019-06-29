import { html } from '../../js_modules/lit-html.js';
import { repeat } from '../../js_modules/npm:lit-html@1.0.0/directives/repeat.js';
import AppSongList from './song.js';
import mediaQuery from '../../lib/mediaquery.js';
import routeMap from '../router/map.js';
import { playlistMap } from '../../models/data-map.js';

export default class AppPlaylistList extends AppSongList {
  render() {
    const { list } = this.data;
    return html`
      <style>
        :host {
          flex-grow: 1;
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(13rem, 1fr));
          grid-template-rows: max-content;
          grid-gap: 2rem;
        }
        @media ${mediaQuery.PHONE} {
          :host {
            padding: 0.4rem;
            grid-template-columns: repeat(auto-fill, minmax(10rem, 1fr));
            grid-gap: 1rem;
          }
        }
      </style>
      ${repeat(list, playlistId => playlistId, this.renderItem)}
    `;
  }

  renderItem = playlistId => {
    const { id, title, image, updatedAt } = playlistMap.get(playlistId);
    const link = {
      path: routeMap.PLAYLIST.path,
      query: `?id=${id}`,
    };
    const data = {
      id,
      image,
      title,
    };
    return html`
      <gallery-item
        title="${title}"
        .link="${link}"
        .data="${data}"
        updatedat="${updatedAt}"
      >
      </gallery-item>
    `;
  };
}

customElements.define('app-playlist-list', AppPlaylistList);
