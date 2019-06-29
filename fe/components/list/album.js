import { html } from '../../js_modules/lit-html.js';
import AppPlaylistList from './playlist.js';
import routeMap from '../router/map.js';

customElements.define(
  'app-album-list',
  class extends AppPlaylistList {
    renderItem = ({ title, cover }) => {
      const link = {
        path: routeMap.SONGS.path,
        query: `?${routeMap.ALBUMS.subTitle}=${encodeURIComponent(title)}`,
      };
      const data = { image: cover, title };
      return html`
        <gallery-item title="${title}" .link="${link}" .data="${data}">
        </gallery-item>
      `;
    };
  },
);
