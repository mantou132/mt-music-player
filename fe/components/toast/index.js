import { html } from '../../js_modules/lit-html.js';
import { store, updateStore } from '../../models/index.js';
import { SingleInstanceComponent } from '../../lib/component.js';

const LIFE_TIME = 3000;
const InitData = Object.assign({}, store.toastState);

const showToastList = [];
let showUploaderState = 0;

export default class AppToast extends SingleInstanceComponent {
  static open(state) {
    updateStore(store.toastState, state);
    setTimeout(() => {
      updateStore(store.toastState, InitData);
    }, LIFE_TIME);
  }

  constructor() {
    super();
    this.state = {
      toastState: store.toastState,
      uploaderState: store.uploaderState,
    };
  }

  preprocess() {
    const {
      toastState: { text },
      uploaderState: { list },
    } = this.state;
    if (list.length) {
      showUploaderState = list.length;
    } else if (showUploaderState) {
      showUploaderState = 'uploaded';
      setTimeout(() => {
        showUploaderState = 0;
        this.update();
      }, LIFE_TIME);
    }

    if (text) {
      const index = showToastList.findIndex(({ text: t }) => t === text);
      if (index > -1) {
        const toast = showToastList[index];
        clearTimeout(toast.timer);
        showToastList.splice(index, 1);
      }
      showToastList.push({
        text,
        timer: setTimeout(() => {
          showToastList.splice(
            showToastList.findIndex(({ text: t }) => t === text),
            1,
          );
          this.update();
        }, LIFE_TIME),
      });
    }
  }

  render() {
    this.preprocess();

    if (!showToastList.length && !showUploaderState) return html``;

    const {
      uploaderState: { errorList },
    } = this.state;

    return html`
      <style>
        :host {
          z-index: 9;
          position: fixed;
          left: 1.6rem;
          bottom: calc(1.6rem + var(--player-height));
          display: flex;
          flex-direction: column;
          color: var(--toast-text-color);
          font-size: 1.4rem;
        }
        div {
          min-width: 20em;
          padding: 0.6em;
          border: 1px solid var(--toast-border-color);
          background: var(--toast-background-color);
        }
        div:not(:last-of-type) {
          margin-bottom: 0.6em;
        }
      </style>
      ${showToastList.map(
        ({ text }) =>
          html`
            <div>${text}</div>
          `,
      )}
      <div ?hidden="${!showUploaderState}">
        ${showUploaderState === 'uploaded'
          ? `upload compelete: failure ${errorList.length}`
          : `${showUploaderState} songs are being uploaded...`}
      </div>
    `;
  }
}

customElements.define('app-toast', AppToast);
