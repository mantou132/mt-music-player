import { html } from '../../js_modules/lit-html.js';
import AppPlaylistList from './playlist.js';
import routeMap from '../router/map.js';

customElements.define(
  'app-album-list',
  class extends AppPlaylistList {
    // eslint-disable-next-line
    renderItem({ title, cover }) {
      return html`
        <app-link
          path="${routeMap.SONGS.path}"
          query="?${routeMap.ALBUMS.subTitle}=${encodeURIComponent(title)}"
          title="${title}"
        >
          <gallery-item .data="${{ image: cover, title }}"> </gallery-item>
        </app-link>
      `;
    }
  },
);
