import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import history from '../../lib/history.js';
import { capitalize } from '../../utils/string.js';
import { store, updateStore } from '../../models/index.js';
import mediaQuery from '../../lib/mediaquery.js';

const InitData = Object.assign({}, store.confirmState);

export default class Confirm extends Component {
  static open(state) {
    updateStore('confirmState', {
      ...InitData,
      ...state,
      isOpen: true,
    });
    history.push({
      title: state.title,
      path: window.location.pathname,
      query: window.location.search,
      close: Confirm.close,
    });
  }

  static close() {
    updateStore('confirmState', { isOpen: false });
  }

  constructor() {
    super();
    this.state = store.confirmState;
    this.okHandle = this.okHandle.bind(this);
    this.cancelHandle = this.cancelHandle.bind(this);
  }

  okHandle() {
    const { oncomplete } = this.state;
    if (oncomplete) oncomplete();
    Confirm.close();
    history.back();
  }

  cancelHandle() {
    const { oncancel } = this.state;
    if (oncancel) oncancel();
    Confirm.close();
    history.back();
  }

  render() {
    const {
      title, complete, cancel, text,
    } = this.state;

    return html`
      <style>
        :host {
          z-index: 10;
          position: fixed;
          top: 0;
          left: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          width: 100%;
          height: 100%;
          opacity: 0;
          pointer-events: none;
        }
        :host(.open) {
          opacity: 1;
          pointer-events: auto;
        }
        .backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .warp {
          flex-shrink: 1;
          position: absolute;
          width: 28rem;
          padding: 1.6rem;
          border-radius: .2rem;
          background: var(--modal-background-color);
          color: var(--modal-text-primary-color);
          fill: var(--modal-text-primary-color);
          box-shadow: var(--modal-box-shadow);
          overflow: auto;
        }
        .title {
          flex-grow: 1;
          margin: 0 0 1.4rem;
          padding: 0;
          font-size: 2rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        .body {
          min-height: 4em;
          margin-bottom: 1em;
        }
        .footer {
          display: flex;
          flex-direction: row-reverse;
        }
        @media ${mediaQuery.PHONE} {
          :host {
            transition-duration: .2s;
            transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
          }
          .backdrop {
            background: var(--backdrop-color);
          }
        }
      </style>
      <div class="backdrop"></div>
      <div class="warp">
        <h1 class="title" ?hidden="${!title}">${title}</h1>
        <div class="body">${capitalize(text)}</div>
        <div class="footer">
            <form-button
              @click="${this.okHandle}"
              ?hidden="${!complete}">
              ${complete}
            </form-button>
            <form-button
              @click="${this.cancelHandle}"
              ?hidden="${!cancel}"
              type="secondary">
              ${cancel}
            </form-button>
        </div>
      </div>
    `;
  }

  connected() {
    this.hidden = false;
  }

  updated() {
    const { isOpen } = this.state;
    if (isOpen) {
      this.classList.add('open');
    } else {
      this.classList.remove('open');
    }
  }
}

customElements.define('app-confirm', Confirm);
