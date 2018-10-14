import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import '../list/index.js';
import '../notfound/index.js';

customElements.define(
  'app-router',
  class extends Component {
    constructor() {
      super();
      this.state = store.historyState;
    }

    render() {
      const { pathname } = window.location;
      let content;
      switch (pathname) {
        case '/':
          content = html`<app-list class="page"></app-list>`;
          break;
        default:
          content = html`<app-notfound class="page"></app-notfound>`;
          break;
      }
      return html`
        <style>
          :host {
            display: contents;
          }
          .page {
            flex-grow: 1;
            overflow: auto;
          }
        </style>
        ${content}
      `;
    }
  },
);
