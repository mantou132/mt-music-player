import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import history from '../../lib/history.js';

customElements.define(
  'app-link',
  class extends Component {
    constructor() {
      super();
      this.onclick = this.clickHandle.bind(this);
    }

    clickHandle() {
      const path = this.getAttribute('path');
      const title = this.getAttribute('title');
      const query = this.getAttribute('query') || '';
      history.push({ title, path, query });
    }

    render() {
      return html`
        <style>
          :host {
            cursor: pointer;
            display: contents;
          }
        </style>
        <slot></slot>
      `;
    }
  },
);
