import { html } from 'https://dev.jspm.io/lit-html';
import AppPlaylistList from './playlist.js';

customElements.define(
  'app-artist-list',
  class extends AppPlaylistList {
    // eslint-disable-next-line
    renderItem({ name, photo }) {
      return html`
        <app-link path="/songs?artist=${encodeURIComponent(name)}" title="songs">
          <gallery-item
            .data="${{ image: photo, title: name }}">
          </gallery-item>
        </app-link>
      `;
    }
  },
);
