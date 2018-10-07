import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';

customElements.define(
  'player-song-info',
  class extends Component {
    render() {
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
          }
          .artist {
            margin-top: 0.28em;
            font-size: .85em;
            color:  var(--player-text-secondary-color);
          }
          </style>
        <img src="http://p2.music.126.net/bQWhKSp88vIwo85OV1zpNA==/109951163466323994.jpg?param=140y140">
        <div>
          <div class="song-name">Song name</div>
          <div class="artist">Artist</div>
        </div>
    `;
    }
  },
);
