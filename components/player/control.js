import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';
import { store } from '../../models/index.js';

customElements.define(
  'player-control',
  class extends Component {
    constructor() {
      super();
      this.state = store.playerState;
    }

    render() {
      const { state } = this.state;
      return html`
        <style>
          :host {
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 24.6rem;
          }
          app-icon.primary {
            padding: 1.3rem;
            border: 2px solid;
            border-radius: 100%;
          }
          app-icon.secondary {
            color: var(--player-text-secondary-color);
            fill: var(--player-text-secondary-color);
          }
        </style>
        <app-icon class="secondary" name="shuffle"></app-icon>
        <app-icon class="secondary" name="skip-previous"></app-icon>
        <!-- TODO: animate -->
        <app-icon class="primary" name="${state === 'pause' ? 'pause' : 'play-arrow'}"></app-icon>
        <app-icon class="secondary" name="skip-next"></app-icon>
        <app-icon class="secondary" name="repeat"></app-icon>
    `;
    }
  },
);
