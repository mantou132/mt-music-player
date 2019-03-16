import { html } from '../../js_modules/lit-html.js';
import AppPlaylistList from './playlist.js';
import routeMap from '../router/map.js';

customElements.define(
  'app-album-list',
  class extends AppPlaylistList {
    // eslint-disable-next-line
    renderItem({ title, cover }) {
      const query = `?${routeMap.ALBUMS.subTitle}=${encodeURIComponent(title)}`;
      const pageTitle = routeMap.SONGS.getSubPageTitle(
        routeMap.ALBUMS.subTitle,
        title,
      );
      return html`
        <app-link
          path="${routeMap.SONGS.path + query}"
          data-title="${pageTitle}"
          title="${title}"
        >
          <gallery-item .data="${{ image: cover, title }}"> </gallery-item>
        </app-link>
      `;
    }
  },
);
