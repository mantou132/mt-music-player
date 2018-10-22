import { html } from 'https://dev.jspm.io/lit-html';
import { store, updateStore } from '../../models/index.js';
import Component from '../../lib/component.js';
import history from '../../lib/history.js';
import mediaQuery from '../../lib/mediaquery.js';

const InitData = Object.assign({}, store.menuState);

export default class AppMenu extends Component {
  static open(state) {
    updateStore('menuState', {
      ...InitData,
      ...state,
    });
    if (mediaQuery.isPhone) {
      history.push({
        title: state.title,
        path: window.location.pathname,
        query: window.location.search,
        close: AppMenu.close,
      });
    }
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
    history.back();
    if (onclose) onclose();
  }

  clickHandle(index) {
    const { list } = this.state;
    this.closeHandle();
    if (mediaQuery.isPhone) {
      setTimeout(list[index].handle, 100);
    } else {
      list[index].handle();
    }
  }

  render() {
    const { list, target, stage } = this.state;
    if (!list || !list.length) return '';

    const stageRect = stage.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const position = { x: targetRect.x, y: targetRect.y + targetRect.height };
    const translate = { x: 0, y: 0 };
    if (stageRect.right - targetRect.right < 169) {
      translate.x = -100;
      position.x = targetRect.x + targetRect.width;
      if (mediaQuery.isPhone) {
        position.y -= targetRect.height;
      }
    }
    if (stageRect.bottom - targetRect.bottom < list.length * 34 + 16) {
      translate.y = -100;
      position.y = targetRect.y;
      if (mediaQuery.isPhone) {
        position.y += targetRect.height;
      }
    }
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
          width: 100%;
          height: 100%;
        }
        .backdrop {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
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
          text-transform: capitalize;
        }
        @media ${mediaQuery.HOVER} {
          li:hover {
            cursor: default;
            background: var(--menu-hover-background-color);
            color: var(--menu-hover-text-color);
          }
        }
      </style>
      <div @click="${this.closeHandle}" class="backdrop"></div>
      <ol
        style="
          left: ${position.x}px;
          top: ${position.y}px;
          transform: translate(${translate.x}%, ${translate.y}%);
        ">
        ${items}
      </ol>
    `;
  }
}
customElements.define('app-menu', AppMenu);
