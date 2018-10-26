import { html } from 'https://dev.jspm.io/lit-html';
import AppPlaylistList from './playlist.js';

customElements.define(
  'app-album-list',
  class extends AppPlaylistList {
    // eslint-disable-next-line
    renderItem({ title, cover }) {
      return html`
        <app-link path="/songs?album=${encodeURIComponent(title)}" title="songs">
          <gallery-item
            .data="${{ image: cover, title }}">
          </gallery-item>
        </app-link>
      `;
    }
  },
);
