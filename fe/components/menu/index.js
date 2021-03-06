import { html } from '../../js_modules/lit-html.js';
import { store, updateStore } from '../../models/index.js';
import { SingleInstanceComponent } from '../../lib/component.js';
import history from '../../lib/history.js';
import mediaQuery from '../../lib/mediaquery.js';

const InitData = Object.assign({}, store.menuState);

export default class AppMenu extends SingleInstanceComponent {
  static open(state) {
    updateStore(store.menuState, {
      ...InitData,
      ...state,
      isOpen: true,
    });
    if (mediaQuery.isPhone) {
      history.pushState({
        title: state.title,
        close: AppMenu.close,
      });
    }
  }

  static close() {
    updateStore(store.menuState, { isOpen: false });
    setTimeout(() => {
      // Restore to default style
      // To perform the animation the next time you open the default menu.
      const { isOpen } = store.menuState;
      if (!isOpen) {
        updateStore(store.menuState, { type: '' });
      }
    }, 200);
  }

  static observedStores = [store.menuState];

  closeHandle = () => {
    const { onclose } = store.menuState;
    AppMenu.close();
    if (mediaQuery.isPhone) history.back();
    if (onclose) onclose();
  };

  clickHandle = index => {
    const { list } = store.menuState;
    this.closeHandle();
    setTimeout(list[index].handle, 100);
  };

  render() {
    const { list, target, stage, type } = store.menuState;
    const position = { x: 0, y: 0 };
    const translate = { x: 0, y: 0 };
    if (stage && target) {
      const stageRect = stage.getBoundingClientRect();
      const targetRect = target.getBoundingClientRect();

      position.x = targetRect.x;
      position.y = targetRect.y + targetRect.height;

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
    }
    const items = list.map(
      (ele, index) => html`
        <li @click="${() => this.clickHandle(index)}">
          ${ele.text}
          <app-ripple type="touch" scale="1"></app-ripple>
        </li>
      `,
    );

    const style =
      type === 'center'
        ? ''
        : `
      left: ${position.x}px;
      top: ${position.y}px;
      transform: translate(${translate.x}%, ${translate.y}%);
    `;
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
        .backdrop.center {
          background: var(--theme-backdrop-color);
        }
        .menu {
          position: absolute;
          overflow: auto;
          scrollbar-width: none;
          border-radius: 0.2rem;
          box-shadow: var(--menu-box-shadow);
        }
        .menu::-webkit-scrollbar {
          width: 0;
        }
        .menu.center {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 30rem;
          max-width: calc(var(--safe-width) * 0.9);
          max-height: calc(var(--safe-height) * 0.9);
        }
        .menu.center ol {
          transition: none;
          width: 100%;
          margin: 0;
        }
        ol {
          width: 16.9rem;
          margin: 0 0 -2rem -3rem;
          padding: 0.8rem 0;
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
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
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
            transition-property: margin, opacity;
            transition-duration: 0.1s;
            transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
          }
        }
      </style>
      <div @click="${this.closeHandle}" class="backdrop ${type}"></div>
      <div class="menu ${type}" style="${style}">
        <ol>
          ${items}
        </ol>
      </div>
    `;
  }

  mounted() {
    this.hidden = false;
  }

  updated() {
    const { isOpen } = store.menuState;
    if (isOpen) {
      this.classList.add('open');
    } else {
      this.classList.remove('open');
    }
  }
}
customElements.define('app-menu', AppMenu);
