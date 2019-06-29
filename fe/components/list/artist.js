import { html } from '../../js_modules/lit-html.js';
import AppPlaylistList from './playlist.js';
import routeMap from '../router/map.js';

customElements.define(
  'app-artist-list',
  class extends AppPlaylistList {
    renderItem = ({ name, photo }) => {
      const link = {
        path: routeMap.SONGS.path,
        query: `?${routeMap.ARTISTS.subTitle}=${encodeURIComponent(name)}`,
      };
      const data = {
        image: photo,
        title: name,
      };
      return html`
        <gallery-item
          title="${name}"
          .link="${link}"
          .data="${data}"
        ></gallery-item>
      `;
    };
  },
);
