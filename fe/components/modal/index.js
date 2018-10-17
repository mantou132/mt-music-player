import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import history from '../../lib/history.js';
import { store, updateStore } from '../../models/index.js';
import '../ripple/index.js';
import '../form/button.js';
import './body.js';

export default class Modal extends Component {
  static open(state) {
    updateStore('modalState', state);
    history.push({
      title: state.title,
      path: window.location.pathname,
      query: window.location.search,
      close: Modal.close,
    });
  }

  static close() {
    updateStore('modalState', {
      title: '',
      complete: 'ok',
      cancel: 'cancel',
      template: null,
      onclose: null,
      oncomplete: null,
      oncancel: null,
    });
  }

  constructor() {
    super();
    this.state = store.modalState;
    this.closeHandle = this.closeHandle.bind(this);
    this.okHandle = this.okHandle.bind(this);
    this.cancelHandle = this.cancelHandle.bind(this);
  }

  okHandle() {
    const { oncomplete } = this.state;
    if (oncomplete) oncomplete();
    Modal.close();
    history.back();
  }

  cancelHandle() {
    const { oncancel } = this.state;
    if (oncancel) oncancel();
    Modal.close();
    history.back();
  }

  closeHandle() {
    const { onclose } = this.state;
    if (onclose) onclose();
    history.back();
  }

  render() {
    const {
      title, complete, cancel, template,
    } = this.state;
    if (!template) {
      this.hidden = true;
      return html``;
    }
    this.hidden = false;
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
          width: 100vw;
          height: 100vh;
        }
        .backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
        }
        .warp {
          flex-shrink: 1;
          position: absolute;
          width: 45rem;
          padding: 1.6rem;
          border-radius: .2rem;
          background: var(--modal-background-color);
          color: var(--modal-text-primary-color);
          fill: var(--modal-text-primary-color);
          box-shadow: var(--modal-box-shadow);
          overflow: auto;
        }
        .titlebar {
          display: flex;
        }
        .title {
          flex-grow: 1;
          margin: 0;
          padding: 0;
          font-size: 2rem;
          font-weight: bolder;
          text-transform: capitalize;
        }
        .close {
          color: var(--modal-text-secondary-color);
          fill: var(--modal-text-secondary-color);
        }
        modal-body {
          display: block;
          padding: 2rem 0;
        }
        .footer {
          display: flex;
          flex-direction: row-reverse;
        }
      </style>
      <div class="backdrop"></div>
      <div class="warp">
        <div class="titlebar">
          <h1 class="title">${title}</h1>
          <app-icon name="clear" class="close" @click="${this.closeHandle}">
            <app-ripple circle color="rgba(0,0,0,0.54)"></app-ripple>
          </app-icon>
        </div>
        <modal-body></modal-body>
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
}

customElements.define('app-modal', Modal);
