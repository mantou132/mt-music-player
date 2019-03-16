import { html } from '../../js_modules/lit-html.js';
import AppPlaylistList from './playlist.js';
import routeMap from '../router/map.js';

customElements.define(
  'app-artist-list',
  class extends AppPlaylistList {
    // eslint-disable-next-line
    renderItem({ name, photo }) {
      return html`
        <app-link
          path="${routeMap.SONGS.path}"
          query="?${routeMap.ARTISTS.subTitle}=${encodeURIComponent(name)}"
          title="${name}"
        >
          <gallery-item .data="${{ image: photo, title: name }}">
          </gallery-item>
        </app-link>
      `;
    }
  },
);
