import { html } from '../../js_modules/lit-html.js';
import { SingleInstanceComponent } from '../../lib/component.js';
import history from '../../lib/history.js';
import { store, updateStore } from '../../models/index.js';
import mediaQuery from '../../lib/mediaquery.js';

import './body.js';

const InitData = Object.assign({}, store.modalState);

export default class Modal extends SingleInstanceComponent {
  static open(state) {
    updateStore(store.modalState, {
      ...InitData,
      ...state,
      isOpen: true,
    });
    history.pushState({
      close: Modal.close,
    });
  }

  static close() {
    updateStore(store.modalState, { isOpen: false });
  }

  static observedStores = [store.modalState];

  okHandle = async () => {
    const { oncomplete } = store.modalState;
    try {
      if (oncomplete) await oncomplete();
      Modal.close();
      history.back();
    } catch (err) {
      //
    }
  };

  cancelHandle = () => {
    const { oncancel } = store.modalState;
    if (oncancel) oncancel();
    Modal.close();
    history.back();
  };

  closeHandle = () => {
    const { onclose } = store.modalState;
    if (onclose) onclose();
    history.back();
  };

  render() {
    const { title, complete, cancel } = store.modalState;

    return html`
      <style>
        :host {
          z-index: 8;
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
          transform: translateY(30%);
        }
        :host(.open) {
          opacity: 1;
          pointer-events: auto;
          transform: translateY(0);
        }
        .backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }
        .modal {
          flex-shrink: 1;
          position: absolute;
          width: 45rem;
          padding: var(--modal-margin);
          border-radius: 2px;
          background: var(--modal-background-color);
          color: var(--modal-text-primary-color);
          fill: var(--modal-text-primary-color);
          box-shadow: var(--modal-box-shadow);
          overflow: auto;
        }
        .titlebar {
          display: flex;
          align-items: center;
          flex-shrink: 0;
        }
        .complete {
          display: none;
        }
        .title {
          flex-grow: 1;
          margin: 0;
          padding: 0;
          font-size: 2rem;
          font-weight: 500;
          text-transform: capitalize;
        }
        .close {
          color: var(--modal-text-secondary-color);
          fill: var(--modal-text-secondary-color);
        }
        modal-body {
          display: block;
          padding: 2.4rem 0;
        }
        .footer {
          display: flex;
          justify-content: flex-end;
          flex-shrink: 0;
        }
        .footer form-button:not(:last-of-type) {
          margin-right: 0.8rem;
        }
        @media ${mediaQuery.PHONE} {
          :host {
            transition-duration: 0.2s;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
          .backdrop {
            background: var(--theme-backdrop-color);
          }
          .modal {
            display: flex;
            flex-direction: column;
            height: 100%;
            width: 100%;
            padding: 0;
            border-radius: 0;
          }
          .titlebar {
            border-bottom: 1px solid var(--action-border-color);
            padding-top: var(--safe-area-inset-top);
          }
          .title {
            padding-left: 1.6rem;
          }
          .close {
            padding: 1.6rem;
            color: inherit;
            fill: inherit;
          }
          modal-body {
            flex-grow: 1;
            padding: 1.6rem;
            overflow: auto;
          }
          .footer {
            padding: 0.8rem 1.6rem;
          }
        }
        @media ${mediaQuery.PHONE} and ${mediaQuery.PWA} {
          .titlebar {
            z-index: 4;
            position: -webkit-sticky;
            position: sticky;
            top: 0;
            flex-direction: row-reverse;
            border-bottom: none;
            background: var(--action-background-color);
            color: var(--action-text-color);
            fill: var(--action-text-color);
            box-shadow: var(--action-box-shadow);
          }
          .complete {
            display: block;
            padding: 1.6rem;
            font-size: 1.4rem;
            font-weight: 500;
            text-transform: uppercase;
          }
          .footer {
            display: none;
          }
        }
      </style>
      <div class="backdrop"></div>
      <div class="modal">
        <div class="titlebar">
          <div
            class="complete"
            @click="${this.okHandle}"
            ?hidden="${!complete}"
          >
            ${complete}
          </div>
          <h1 class="title">${title}</h1>
          <app-icon name="clear" class="close" @click="${this.closeHandle}">
            <app-ripple circle color="rgba(0,0,0,0.54)"></app-ripple>
          </app-icon>
        </div>
        <modal-body></modal-body>
        <div class="footer">
          <form-button
            @click="${this.cancelHandle}"
            ?hidden="${!cancel}"
            type="secondary"
          >
            ${cancel}
          </form-button>
          <form-button @click="${this.okHandle}" ?hidden="${!complete}">
            ${complete}
          </form-button>
        </div>
      </div>
    `;
  }

  mounted() {
    this.hidden = false;
  }

  updated() {
    const { isOpen } = store.modalState;
    if (isOpen) {
      this.classList.add('open');
    } else {
      this.classList.remove('open');
    }
  }
}

customElements.define('app-modal', Modal);
