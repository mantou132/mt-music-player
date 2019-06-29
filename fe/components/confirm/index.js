import { html } from '../../js_modules/lit-html.js';
import { SingleInstanceComponent } from '../../lib/component.js';
import history from '../../lib/history.js';
import { capitalize } from '../../utils/string.js';
import { store, updateStore } from '../../models/index.js';
import mediaQuery from '../../lib/mediaquery.js';

const InitData = Object.assign({}, store.confirmState);

export default class Confirm extends SingleInstanceComponent {
  static open(state) {
    updateStore(store.confirmState, {
      ...InitData,
      ...state,
      isOpen: true,
    });
    history.pushState({
      title: state.title,
      close: Confirm.close,
    });
  }

  static close() {
    updateStore(store.confirmState, { isOpen: false });
  }

  static observedStores = [store.confirmState];

  okHandle = () => {
    const { oncomplete } = store.confirmState;
    if (oncomplete) oncomplete();
    Confirm.close();
    history.back();
  };

  cancelHandle = () => {
    const { oncancel } = store.confirmState;
    if (oncancel) oncancel();
    Confirm.close();
    history.back();
  };

  render() {
    const { title, complete, cancel, text } = store.confirmState;

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
          border-radius: 0.2rem;
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
            transition-duration: 0.2s;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
          .backdrop {
            background: var(--theme-backdrop-color);
          }
        }
      </style>
      <div class="backdrop"></div>
      <div class="warp">
        <h1 class="title" ?hidden="${!title}">${title}</h1>
        <div class="body">${capitalize(text)}</div>
        <div class="footer">
          <form-button @click="${this.okHandle}" ?hidden="${!complete}">
            ${complete}
          </form-button>
          <form-button
            @click="${this.cancelHandle}"
            ?hidden="${!cancel}"
            type="secondary"
          >
            ${cancel}
          </form-button>
        </div>
      </div>
    `;
  }

  mounted() {
    this.hidden = false;
  }

  updated() {
    const { isOpen } = store.confirmState;
    if (isOpen) {
      this.classList.add('open');
    } else {
      this.classList.remove('open');
    }
  }
}

customElements.define('app-confirm', Confirm);
