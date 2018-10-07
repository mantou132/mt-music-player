import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';

customElements.define(
  'player-progress',
  class extends Component {
    render() {
      return html`
        <style>
          :host {
            width: 0%;
            height: 3px;
            background: var(--theme-color);
          }
        </style>
    `;
    }
  },
);
