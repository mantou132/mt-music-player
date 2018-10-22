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
      isOpen: true,
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
    updateStore('menuState', { isOpen: false });
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
    setTimeout(list[index].handle, 100);
  }

  render() {
    const { list, target, stage } = this.state;

    const position = { x: 0, y: 0 };
    const translate = { x: 0, y: 0 };
    if (stage && target) {
      const stageRect = stage.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();
      if (stageRect.right - targetRect.right < 169) {
        translate.x = -100;
        position.x = targetRect.x + targetRect.width;
        position.y = targetRect.y + targetRect.height;
        if (mediaQuery.isPhone) {
          position.y -= targetRect.height;
        }
      }
      if (stageRect.bottom - targetRect.bottom < list.length * 34 + 16) {
        translate.y = -100;
        position.x = targetRect.x;
        position.y = targetRect.y;
        if (mediaQuery.isPhone) {
          position.y += targetRect.height;
        }
      }
    }
    const items = list.map(
      (ele, index) => html`
        <li @click="${() => this.clickHandle(index)}">
          ${ele.text}
          <app-ripple type="touch" scale="1"></app-ripple>
        </li>
      `,
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
        .menu {
          position: absolute;
          overflow: hidden;
          border-radius: .2rem;
          box-shadow: var(--menu-box-shadow);
        }
        ol {
          width: 16.9rem;
          margin: 0 0 -2rem -3rem;
          padding: .8rem 0;
          background: var(--menu-background-color);
          color: var(--menu-text-color);
        }
        :host(.open) ol {
          margin: 0;
        }
        li {
          position: relative;
          line-height: 4.4rem;
          padding: 0px 1.4rem;
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
        @media ${mediaQuery.PHONE} {
          ol {
            padding: 0;
          }

          :host,
          ol {
            transition-duration: .1s;
            transition-timing-function: cubic-bezier(0.4, 0.0, 0.2, 1);
          }
        }
      </style>
      <div @click="${this.closeHandle}" class="backdrop"></div>
      <div
        class="menu"
        style="
          left: ${position.x}px;
          top: ${position.y}px;
          transform: translate(${translate.x}%, ${translate.y}%);
        ">
        <ol>${items}</ol>
      </div>
    `;
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
customElements.define('app-menu', AppMenu);
