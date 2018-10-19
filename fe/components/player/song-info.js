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
            flex-shrink: 0;
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
          .wrap {
            width: 0;
            flex-grow: 1;
          }
          .name,
          .artist {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .artist {
            margin-top: 0.28em;
            font-size: .85em;
            color:  var(--player-text-secondary-color);
          }
          @media (min-width: 20em) and (max-width: 30em) {
            :host-context(app-player:not([maximize])) img {
              display: none;
            }
            :host-context(app-player[maximize]) {
              flex-direction: column;
              font-size: 1.6rem;
            }
            :host-context(app-player[maximize]) img {
              width: var(--player-info-width);
              height: var(--player-info-width);
              margin: 0;
            }
            :host-context(app-player[maximize]) .wrap {
              width: auto;
              margin: 1.6rem;
              text-align: center;
            }
            :host-context(app-player[maximize]) .name {
              width: auto;
            }
            :host-context(app-player[maximize]) .artist {
              width: auto;
            }
          }
        </style>
        <img alt="" src="${song.picture ? `//${config.storage}/${song.picture}` : ''}">
        <div class="wrap">
          <div class="name">${song.title}</div>
          <div class="artist">${song.title ? song.artist || 'unknown' : ''}</div>
        </div>
    `;
    }
  },
);
