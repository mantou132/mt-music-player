import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';

customElements.define(
  'app-modal',
  class extends Component {
    constructor() {
      super();
      this.state = store.modalState;
    }

    render() {
      return html`
        <style>
          :host {
            z-index: 8;
            position: fixed;
            top: 0;
            left: 0;
            display: flex;
          }
        </style>
        <slot name="1"></slot>
        <slot name="2"></slot>
        <slot name="3"></slot>
      `;
    }

    open() {}

    close() {}
  },
);
