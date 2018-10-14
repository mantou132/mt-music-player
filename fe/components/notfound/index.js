import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import '../link/index.js';

customElements.define(
  'app-notfound',
  class extends Component {
    render() {
      return html`
        <style>
          :host {
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            background: var(--notfound-background-color);
            color: var(--notfound-text-secondary-color);
            fill: var(--notfound-text-secondary-color);
          }
          h1 {
            margin: .2em 0;
            font-size: 3em;
            font-weight: bold;
            text-transform: uppercase;
          }
          app-link {
            color: var(--notfound-text-primary-color);
          }
        </style>
        <h1>not found</h1>
        <app-link path="/">go to songs list</app-link>
      `;
    }
  },
);
