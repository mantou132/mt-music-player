import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import AppUpload from '../upload/index.js';
import { store } from '../../models/index.js';
import { search } from '../../services/song.js';
import mediaQuery from '../../lib/mediaquery.js';
import Drawer from '../drawer/index.js';
import Modal from '../modal/index.js';
import getAddPlaylistModal from '../modals/add-playlist.js';
import routeMap from '../router/map.js';

function getTitle() {
  return html`
    <app-title class="title"></app-title>
  `;
}

function getUploadButton() {
  return html`
    <app-icon @click="${AppUpload.open}" name="add">
      <app-ripple scale=".8" circle></app-ripple>
    </app-icon>
  `;
}

function getMenuButton() {
  return html`
    <app-icon @click="${Drawer.open}" name="menu">
      <app-ripple scale=".8" circle></app-ripple>
    </app-icon>
  `;
}

function getSearchButton() {
  return html`
    <app-link path="${routeMap.SEARCH.path}">
      <app-icon name="search">
        <app-ripple scale=".8" circle></app-ripple>
      </app-icon>
    </app-link>
  `;
}

function getAddPlaylistButton() {
  return html`
    <app-icon
      name="playlist-add"
      @click="${() => Modal.open(getAddPlaylistModal())}"
    >
      <app-ripple scale=".8" circle></app-ripple>
    </app-icon>
  `;
}

function getBackButton() {
  return html`
    <app-link path="${routeMap.HOME.path}" title="back">
      <app-icon name="arrow-back">
        <app-ripple scale=".8" circle></app-ripple>
      </app-icon>
    </app-link>
  `;
}

function getSearchInput() {
  const query = new URLSearchParams(window.location.search);
  return html`
    <form-text
      class="input"
      value="${query.get('q') || store.searchData.text}"
      autofocus
      @change="${({ detail }) => search(detail)}"
    >
    </form-text>
  `;
}
export default class AppAction extends Component {
  static TITLE() {}

  static UPLOAD() {}

  static SEARCH() {}

  static BACK() {}

  static ADD_PLAYLIST() {}

  static MENU() {}

  static SEARCH_INPUT() {}

  static get observedPropertys() {
    return ['actions'];
  }

  constructor() {
    super();
    this.state = store.selectorState;
  }

  getContents() {
    return this.actions.map(ele => {
      switch (ele) {
        case AppAction.TITLE:
          return getTitle();
        case AppAction.UPLOAD:
          return getUploadButton();
        case AppAction.SEARCH:
          return getSearchButton();
        case AppAction.BACK:
          return getBackButton();
        case AppAction.ADD_PLAYLIST:
          return getAddPlaylistButton();
        case AppAction.MENU:
          return getMenuButton();
        case AppAction.SEARCH_INPUT:
          return getSearchInput();
        default:
          return '';
      }
    });
  }

  render() {
    if (!this.actions.length) return html``;

    return html`
      <style>
        :host {
          flex-shrink: 0;
          display: flex;
          align-items: center;
          padding: calc(1.6rem + env(safe-area-inset-top)) 1.6rem 1.6rem;
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
        @media ${mediaQuery.LAPTOP}, ${mediaQuery.DESKTOP} {
          app-icon[name='menu'] {
            display: none;
          }
        }
        @media ${mediaQuery.PHONE} and ${mediaQuery.PWA} {
          :host {
            z-index: 4;
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            padding: calc(0.4rem + env(safe-area-inset-top)) 0.4rem 0.4rem;
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
            font-weight: 500;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .contents app-icon {
            padding: 1.2rem;
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
}
customElements.define('app-action', AppAction);
