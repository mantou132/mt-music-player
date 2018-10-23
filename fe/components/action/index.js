import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import AppUpload from '../upload/index.js';
import { store } from '../../models/index.js';
import { search } from '../../services/song.js';
import mediaQuery from '../../lib/mediaquery.js';
import { capitalize } from '../../utils/string.js';

function getTitle() {
  return html`<h1 class="title">${capitalize(document.title)}</h1>`;
}

function getUploadButton() {
  return html`
    <app-icon
      @click="${AppUpload.open}"
      name="add">
      <app-ripple circle></app-ripple>
    </app-icon>
  `;
}

function getSearchButton() {
  return html`
    <app-link path="/search">
      <app-icon name="search">
        <app-ripple circle></app-ripple>
      </app-icon>
    </app-link>
  `;
}

function getBackButton() {
  return html`
    <app-link path="/">
      <app-icon name="arrow-back">
        <app-ripple circle></app-ripple>
      </app-icon>
    </app-link>
  `;
}

function getSearchInput() {
  const query = new URLSearchParams(window.location.search);
  return html`
    <form-text
      class="input"
      value="${query.get('q') || ''}"
      autofocus
      @change="${({ detail }) => search(detail)}">
    </form-text>
  `;
}

customElements.define(
  'app-action',
  class extends Component {
    constructor() {
      super();
      this.state = store.selectorState;
    }

    getContents() {
      return this.actions.map((ele) => {
        if (ele === 'title') return getTitle();
        if (ele === 'upload') return getUploadButton();
        if (ele === 'search') return getSearchButton();
        if (ele === 'back') return getBackButton();
        if (ele === 'searchInput') return getSearchInput();
        return '';
      });
    }

    render() {
      return html`
        <style>
          :host {
            display: flex;
            align-items: center;
            padding: 1.6rem;
          }
          .title {
            display: none;
          }
          .contents {
            display: contents;
          }
          .contents app-icon {
            margin-right: 1.6rem;
          }
          @media ${mediaQuery.PHONE} and ${mediaQuery.PWA} {
            :host {
              z-index: 4;
              position: -webkit-sticky;
              position: sticky;
              top: 0;
              padding: 0 .4rem;
              background: var(--action-background-color);
              color: var(--action-text-color);
              fill: var(--action-text-color);
              box-shadow: var(--action-box-shadow);
            }
            .title {
              flex-grow: 1;
              display: block;
              margin: 0;
              padding: 0 1.2rem;
              font-size: 2rem;
              font-weight: bolder;
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
            .contents app-icon {
              padding: 1.6rem 1.2rem;
            }
            .contents > * {
              margin-right: 0;
            }
            .input {
              padding-right: 1.2rem;
            }
          }
        </style>
        <div class="contents">
          ${this.getContents()}
        </div>
      `;
    }
  },
);
