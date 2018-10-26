import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import { getSrc } from '../../utils/misc.js';
import mediaQuery from '../../lib/mediaquery.js';
import { update } from '../../services/song.js';

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
          .img {
            --padding: 1.6rem;
            position: relative;
            flex-shrink: 0;
            margin: var(--padding);
            width: calc(var(--player-height) - (var(--padding)) * 2);
            box-shadow: var(--player-cover-box-shadow);
          }
          .img::after {
            content: '';
            display: block;
            padding-bottom: 100%;
          }
          img {
            position: absolute;
            width: 100%;
            height: 100%;
            object-fit: cover;
            overflow: hidden;
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
          @media ${mediaQuery.PHONE} {
            :host(:not([maximize])) .img {
              display: none;
            }
            :host([maximize]) {
              flex-direction: column;
              font-size: 1.6rem;
            }
            :host([maximize]) .img {
              display: flex;
              flex-shrink: 1;
              width: calc(100vw - 3.2em);
              margin: 0;
            }
            :host([maximize]) .wrap {
              box-sizing: border-box;
              width: calc(100vw - 3.2em);
              padding: 1.6rem 0;
              text-align: center;
            }
            :host([maximize]) .name {
              width: auto;
            }
            :host([maximize]) .artist {
              width: auto;
            }
          }
          @media ${mediaQuery.SMALL_PHONE} {
            :host([maximize]) .img {
              height: 0;
              flex-grow: 1;
            }
            :host([maximize]) .wrap {
              flex-grow: 0;
            }
          }
          @media ${mediaQuery.WATCH} {
            .img {
              display: none;
            }
            .wrap {
              width: 100%;
            }
          }
          @media ${mediaQuery.SHORT} {
            .img {
              width: 20vw;
              height: 100%;
              margin-left: 0;
            }
          }
        </style>
        <div class="img">
          <img alt="" src="${getSrc(song.picture)}">
        </div>
        <div class="wrap">
          <div class="name">${song.title}</div>
          <div class="artist">${song.title ? song.artist || 'unknown' : ''}</div>
        </div>
        <app-icon
          @click="${() => update(song.id, { star: song.star ? 0 : 1 })}"
          name="${song.star ? 'star' : 'star-border'}">
          <app-ripple circle></app-ripple>
        </app-icon>
    `;
    }
  },
);
