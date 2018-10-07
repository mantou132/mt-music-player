import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';
import '../range/index.js';
import { store } from '../../models/index.js';

customElements.define(
  'player-volume',
  class extends Component {
    constructor() {
      super();
      this.state = store.playerState;
    }

    render() {
      const { volume } = this.state;
      return html`
        <style>
          :host {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
          }
          app-icon {
            margin-right: 1.6rem;
          }
          app-range {
            width: 14.4rem;
            margin-right: 2.4rem;
          }
        </style>
        <app-range value="${volume}"></app-range>
        <app-icon name="volume-down"></app-icon>
    `;
    }
  },
);
