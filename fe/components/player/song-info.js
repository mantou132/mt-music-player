import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import { getSrc } from '../../utils/misc.js';
import mediaQuery from '../../lib/mediaquery.js';
import { update } from '../../services/song.js';
import AppMenu from '../menu/index.js';
import { addSong } from '../../services/playlist.js';

customElements.define(
  'player-song-info',
  class extends Component {
    constructor() {
      super();
      this.state = store.playerState;
      this.addToPlaylist = this.addToPlaylist.bind(this);
    }

    addToPlaylist() {
      const { currentSong } = this.state;
      const { list } = store.playlistData;
      AppMenu.open({
        type: 'center',
        list: list.map(({ title, id }) => ({
          text: title,
          handle() {
            addSong(id, currentSong);
          },
        })),
      });
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
            display: contents;
          }
          .text {
            overflow: hidden;
          }
          .name,
          .artist {
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          .artist {
            margin-top: 0.28em;
            font-size: 0.85em;
            color: var(--player-text-secondary-color);
          }
          .wrap app-icon {
            padding: 1.6rem;
          }
          .add-playlist {
            display: none;
          }
          @media ${mediaQuery.PHONE} {
            :host(:not([maximize])) .img,
            :host(:not([maximize])) .star {
              display: none;
            }
            :host([maximize]) {
              flex-direction: column;
              font-size: 1.6rem;
            }
            :host([maximize]) .img {
              display: flex;
              flex-shrink: 1;
              width: calc(100vw - 5.6rem);
              margin: 0;
            }
            :host([maximize]) .text {
              flex-grow: 1;
              box-sizing: border-box;
              padding: 1.6rem 0;
              text-align: center;
            }
            :host([maximize]) .wrap {
              display: flex;
              width: 100%;
            }
            :host([maximize]) .star {
              order: -1;
            }
            :host([maximize]) .add-playlist {
              display: block;
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
            .img,
            .wrap app-icon {
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
          <img alt="" src="${getSrc(song.picture)}" />
        </div>
        <div class="wrap">
          <div class="text">
            <div class="name">${song.title}</div>
            <div class="artist">
              ${song.title ? song.artist || 'unknown' : ''}
            </div>
          </div>
          <app-icon
            class="add-playlist"
            @click="${this.addToPlaylist}"
            name="add-circle-outline"
          >
            <app-ripple circle></app-ripple>
          </app-icon>
          <app-icon
            class="star"
            @click="${() => update(song.id, { star: song.star ? 0 : 1 })}"
            name="${song.star ? 'star' : 'star-border'}"
          >
            <app-ripple circle></app-ripple>
          </app-icon>
        </div>
      `;
    }
  },
);
