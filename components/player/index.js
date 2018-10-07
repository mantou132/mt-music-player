import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';
import './song-info.js';
import './control.js';
import './volume.js';
import './progress.js';
import { store } from '../../models/index.js';

customElements.define(
  'app-player',
  class extends Component {
    constructor() {
      super();
      this.state = store.playerState;
      document.addEventListener('mousemove', () => {
        this.setState({
          state: Math.random() > 0.5 ? 'pause' : 'playing',
        });
      });
    }

    render() {
      return html`
        <style>
          :host {
            display: flex;
            background: var(--player-background-color);
            border-top: 1px solid var(--player-separator-color);
            color:  var(--player-text-primary-color);
            fill:  var(--player-text-primary-color);
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
        <player-song-info></player-song-info>
        <player-control></player-control>
        <player-volume></player-volume>
        <player-progress></player-state>
    `;
    }
  },
);
