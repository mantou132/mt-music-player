import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import config from '../../config/index.js';

customElements.define(
  'player-song-info',
  class extends Component {
    constructor() {
      super();
      this.state = store.playerState;
    }

    render() {
      const { currentSong } = this.state;
      const { list } = store.songData;
      const song = list.find(e => e.id === currentSong) || {};
      return html`
        <style>
          :host {
            display: flex;
            align-items: center;
            font-size: 1.4rem;
          }
          img {
            --padding: 1.6rem;
            margin: var(--padding);
            width: calc(var(--player-height) - (var(--padding)) * 2);
            height: calc(var(--player-height) - (var(--padding)) * 2);
            object-fit: cover;
            overflow: hidden;
            box-shadow: var(--player-cover-box-shadow);
          }
          img::before {
            content: '';
            display: inline-block;
            width: 100%;
            height: 100%;
            background: var(--player-text-secondary-color) center no-repeat;
            background-size: contain;
          }
          img:not([src])::before {
            visibility: hidden;
          }
          .artist {
            margin-top: 0.28em;
            font-size: .85em;
            color:  var(--player-text-secondary-color);
          }
        </style>
        <img alt="" src="${song.picture ? `//${config.storage}/${song.picture}` : ''}">
        <div>
          <div class="song-name">${song.title}</div>
          <div class="artist">${song.title ? song.artist || 'unknown' : ''}</div>
        </div>
    `;
    }
  },
);
