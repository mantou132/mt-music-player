import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { store, updateStore } from '../../models/index.js';
import mediaQuery from '../../lib/mediaquery.js';
import { update } from '../../services/song.js';
import AppMenu from '../menu/index.js';
import { addSong } from '../../services/playlist.js';
import { songMap, playlistMap } from '../../models/data-map.js';

customElements.define(
  'player-song-info',
  class extends Component {
    static observedStores = [store.playerState];

    addToPlaylist = () => {
      const { currentSong } = store.playerState;
      const { list } = store.playlistData;
      AppMenu.open({
        type: 'center',
        list: list.map(playlistId => ({
          text: playlistMap.get(playlistId).title,
          handle() {
            addSong(playlistId, currentSong);
          },
        })),
      });
    };

    tooglePipMode = () => {
      const { pip } = store.playerState;
      updateStore(store.playerState, { pip: !pip });
    };

    render() {
      const { currentSong, pip } = store.playerState;
      const song = songMap.get(currentSong);
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
          .pip {
            display: none;
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
          @media ${mediaQuery.HOVER} {
            .img:hover .pip:not([hidden]) {
              display: flex;
              position: absolute;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              justify-content: center;
              align-items: center;
              background: rgba(0, 0, 0, 0.45);
              cursor: pointer;
            }
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
          <app-img
            data-src="${song.picture || ''}"
            data-alt="${song.title}"
          ></app-img>
          <div
            class="pip"
            ?hidden="${!document.pictureInPictureEnabled}"
            @click="${this.tooglePipMode}"
          >
            <app-icon name="${pip ? 'pip-open' : 'pip'}"></app-icon>
          </div>
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
