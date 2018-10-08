import { html } from 'https://dev.jspm.io/lit-html';
import { store } from '../../models/index.js';
import Component from '../index.js';

export default class AppMenu extends Component {
  constructor() {
    super();
    AppMenu.instance = this;
    this.state = store.menuState;
    this.closeHandle = this.closeHandle.bind(this);
  }

  closeHandle() {
    this.setState({
      list: [],
    });
  }

  render() {
    const {
      list,
      position: { x, y },
    } = this.state;
    if (!list || !list.length) return '';
    return html`
      <style>
        :host {
          display: block;
          width: 0;
          height: 0;
        }
        .backdrop {
          position: absolute;
          top: 0;
          height: 0;
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
        ${list.map(ele => html`<li>${ele.text}</li>`)}
      </ol>
    `;
  }
}
customElements.define('app-menu', AppMenu);
