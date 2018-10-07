import { html, render } from 'https://dev.jspm.io/lit-html';

customElements.define(
  'app-icon',
  class extends HTMLElement {
    static get observedAttributes() {
      return ['name'];
    }

    constructor() {
      super();
      this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
      const name = this.getAttribute('name');
      // lit-html unable to render '<svg>' string to become DOM
      const template = document.querySelector(`#icon-${name}`);
      // Why using innerHTML will be slow?
      // lit-html is no direct rendering between shadowDOM, use `template.innerHTML`
      render(
        html`
          <style>
            :host {
              width: 2.4rem;
              height: 2.4rem;
            }
          </style>
          ${template.cloneNode(true).content}
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
