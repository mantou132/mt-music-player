import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import './song-info.js';
import './control.js';
import './volume.js';
import './progress.js';
import './audio.js';

customElements.define(
  'app-player',
  class extends Component {
    render() {
      return html`
        <style>
          :host {
            position: sticky;
            bottom: 0;
            flex-shrink: 0;
            height: var(--player-height);
            display: flex;
            background: var(--player-background-color);
            border-top: 1px solid var(--player-separator-color);
            color: var(--player-text-primary-color);
            fill: var(--player-text-primary-color);
          }
          player-control {
            flex-shrink: 0;
          }
          player-song-info,
          player-volume {
            width: -moz-available;
            width: -webkit-fill-available;
          }
          player-progress {
            position: absolute;
            left: 0;
            top: 0;
          }
        </style>
        <player-audio></player-audio>
        <player-song-info></player-song-info>
        <player-control></player-control>
        <player-volume></player-volume>
        <player-progress></player-state>
    `;
    }
  },
);
