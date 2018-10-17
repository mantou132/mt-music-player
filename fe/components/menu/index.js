import { html } from 'https://dev.jspm.io/lit-html';
import { store, updateStore } from '../../models/index.js';
import Component from '../../lib/component.js';

const InitData = Object.assign({}, store.menuState);

export default class AppMenu extends Component {
  static open(state) {
    updateStore('menuState', {
      ...InitData,
      ...state,
    });
  }

  static close() {
    updateStore('menuState', InitData);
  }

  constructor() {
    super();
    this.state = store.menuState;
    this.closeHandle = this.closeHandle.bind(this);
  }

  closeHandle() {
    const { onclose } = this.state;
    AppMenu.close();
    if (onclose) onclose();
  }

  clickHandle(index) {
    const { list } = this.state;
    list[index].handle();
    this.closeHandle();
  }

  render() {
    const {
      list,
      position: { x, y },
    } = this.state;
    if (!list || !list.length) return '';
    const items = list.map(
      (ele, index) => html`<li @click="${() => this.clickHandle(index)}">${ele.text}</li>`,
    );
    return html`
      <style>
        :host {
          z-index: 10;
          position: fixed;
          left: 0;
          top: 0;
          display: block;
          width: 0;
          height: 0;
        }
        .backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
        }
        ol {
          position: absolute;
          width: 16.9rem;
          margin: 0;
          padding: .8rem 0;
          border-radius: .2rem;
          background: var(--menu-background-color);
          color: var(--menu-text-color);
          box-shadow: var(--menu-box-shadow);
        }
        li {
          padding: .8rem 1.6rem .8rem 2.4rem;
          list-style: none;
        }
        li:hover {
          cursor: default;
          background: var(--menu-hover-background-color);
          color: var(--menu-hover-text-color);
        }
      </style>
      <div @click="${this.closeHandle}" class="backdrop"></div>
      <ol style="left: ${x}px; top: ${y}px">
        ${items}
      </ol>
    `;
  }
}
customElements.define('app-menu', AppMenu);
