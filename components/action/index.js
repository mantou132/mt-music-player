import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';

customElements.define(
  'app-action',
  class extends Component {
    render() {
      return html`
        <style>
          :host {
            display: flex;
          }
        </style>
        <slot name="1"></slot>
        <slot name="2"></slot>
        <slot name="3"></slot>
      `;
    }
  },
);
