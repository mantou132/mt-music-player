import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';
import { store } from '../../models/index.js';
import { secondToMinute } from '../../utils/datetime.js';

customElements.define(
  'list-item',
  class extends Component {
    static get observedAttributes() {
      return ['id'];
    }

    render() {
      const { list } = store.songData;
      const { list: artistList } = store.artistData;
      const song = list.find(e => String(e.id) === this.id) || {};
      const artist = artistList.find(e => e.id === song.artistId) || {};
      return html`
        <style>
          :host {
            display: flex;
            padding: 1.6rem;
          }
          :host(:hover) {
            background: var(--list-hover-background-color);
          }
          :host([active]) {
            --list-item-playing-color: var(--theme-color);
          }
          .info {
            flex-grow: 1;
          }
          .title {
            color: var(--list-item-playing-color);
            fill: var(--list-item-playing-color);
          }
          slot:not([hidden]) {
            display: inline-block;
            vertical-align: middle;
            margin: -.6rem 0 -.4rem -.5rem;
          }
          .name {
            margin-top: .25em;
          }
          .name:blank {
            display: none;
          }
          .name,
          .duration {
            font-size: .875em;
            color: var(--list-text-secondary-color);
          }
          .more {
            display: none;
          }
          :host(:hover) .more {
            display: block;
          }
          .more app-icon {
            display: inline-block;
            margin-top: -.2rem;
          }
          .more,
          .duration {
            min-width: 4rem;
            padding-left: .75rem;
            text-align: right;
          }
          .duration {
            padding-top: .125em;
            color: var(--list-item-playing-color);
          }
        </style>
        <div class="info">
          <div class="title">
            <slot></slot>
            ${song.title}
          </div>
          <div class="name">${artist.name}</div>
        </div>
        <div class="more">
          <app-icon name="more-horiz"></app-icon>
        </div>
        <div class="duration">
          ${secondToMinute(song.duration)}
        </div>
    `;
    }
  },
);
