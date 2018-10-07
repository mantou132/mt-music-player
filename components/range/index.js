import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';

customElements.define(
  'app-range',
  class extends Component {
    static get observedAttributes() {
      return ['value'];
    }

    render() {
      const value = this.getAttribute('value');

      return html`
        <style>
          :host {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
          }
        </style>
        <div>${value}</div>
    `;
    }
  },
);
