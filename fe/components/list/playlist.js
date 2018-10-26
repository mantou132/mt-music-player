import { html } from 'https://dev.jspm.io/lit-html';
import AppSongList from './song.js';
import mediaQuery from '../../lib/mediaquery.js';

export default class AppPlaylistList extends AppSongList {
  constructor() {
    super();
    this.renderItem = this.renderItem.bind(this);
  }

  render() {
    const { list } = this.state.data;
    return html`
      <style>
        :host {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(13rem, 1fr));
          grid-gap: 2rem;
        }
        @media ${mediaQuery.PHONE} {
          :host {
            padding: .4rem;
            grid-template-columns: repeat(auto-fit, minmax(10rem, 1fr));
            grid-gap: 1rem;
          }
        }
      </style>
      ${list.map(this.renderItem)}
    `;
  }

  // eslint-disable-next-line
  renderItem({ id, title, image, updatedAt }) {
    return html`
      <app-link path="/playlist?id=${id}" title="playlist">
        <gallery-item
          .data="${{ id, image, title }}"
          updatedat="${updatedAt}">
        </gallery-item>
      </app-link>
    `;
  }
}

customElements.define('app-playlist-list', AppPlaylistList);
