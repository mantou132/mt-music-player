import { html, render } from '../js_modules/lit-html.js';

customElements.define(
  'app-icon',
  class extends HTMLElement {
    static observedAttributes = ['name'];

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      const name = this.getAttribute('name');
      const template = document.querySelector(`#icon-${name}`);
      render(
        html`
          <style>
            :host {
              position: relative;
              width: 2.4rem;
              height: 2.4rem;
            }
            :host(:not([hidden])) {
              display: inline-block;
            }
          </style>
          ${template.cloneNode(true).content}
          <slot></slot>
        `,
        this.shadowRoot,
      );
    }

    attributeChangedCallback(attributeName, newValue, oldValue) {
      if (!this.isConnected || newValue === oldValue) return;
      if (attributeName === 'name') {
        this.connectedCallback();
      }
    }
  },
);
