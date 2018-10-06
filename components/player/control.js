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
          app-icon {
            fill: var(--player-text-secondary-color);
            width: 2.4rem;
            height: 2.4rem;
          }
          app-icon.primary {
            padding: 1.3rem;
            color: var(--player-text-primary-color);
            fill: var(--player-text-primary-color);
            border: 2px solid;
            border-radius: 100%;
          }
        </style>
        <app-icon name="shuffle"></app-icon>
        <app-icon name="skip-previous"></app-icon>
        <!-- TODO: animate -->
        <app-icon class="primary" name="${state === 'pause' ? 'pause' : 'play-arrow'}"></app-icon>
        <app-icon name="skip-next"></app-icon>
        <app-icon name="repeat"></app-icon>
    `;
    }
  },
);
