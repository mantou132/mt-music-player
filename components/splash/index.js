import '../../icons/icon.js';
import { html } from '../../utils/html.js';

const tempEle = html`
  <style>
    :host {
      background: var(--background-color);
      width: 100vw;
      height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    app-icon {
      width: 10em;
      height: 10em;
      fill: var(--theme-color);
    }
  </style>
  <app-icon></app-icon>
`;

class AppSplash extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.append(tempEle.content);
  }
}
customElements.define('app-splash', AppSplash);
