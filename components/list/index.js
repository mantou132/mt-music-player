import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';
import './item.js';

customElements.define(
  'app-list',
  class extends Component {
    render() {
      return html`
        <style>
          :host {
            background: var(--list-background-color);
          }
        </style>
        <list-item></list-item>
    `;
    }
  },
);
