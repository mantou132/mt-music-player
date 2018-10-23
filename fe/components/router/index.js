import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';

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
          content = html`
            <app-list
              .data="${store.songData}"
              .actions="${['title', 'upload', 'search']}">
            </app-list>
          `;
          break;
        case '/search':
          content = html`
            <app-list
              .data="${store.searchData}"
              .actions="${['back', 'searchInput']}">
            </app-list>
          `;
          break;
        default:
          content = html`<app-notfound></app-notfound>`;
      }
      return html`
        <style>
          :host {
            display: contents;
          }
          :host > * {
            flex-grow: 1;
            overflow: auto;
          }
        </style>
        ${content}
      `;
    }
  },
);
