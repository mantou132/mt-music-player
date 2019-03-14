import { html } from '../../js_modules/lit-html.js';
import AppPlaylistList from './playlist.js';

customElements.define(
  'app-album-list',
  class extends AppPlaylistList {
    // eslint-disable-next-line
    renderItem({ title, cover }) {
      return html`
        <app-link
          path="/songs?album=${encodeURIComponent(title)}"
          data-title="album - ${title}"
          title="${title}"
        >
          <gallery-item .data="${{ image: cover, title }}"> </gallery-item>
        </app-link>
      `;
    }
  },
);
