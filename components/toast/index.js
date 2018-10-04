import { html } from '../../utils/html.js';
import { store, connect } from '../../models/index.js';

const tempEle = html`
  <style>
    :host {
      position: fixed;
      left: 1em;
      bottom: 1em;
    }
  </style>
  <span id="text"></span>
`;

class AppToast extends HTMLElement {
  constructor() {
    super();

    const shadowRoot = this.attachShadow({ mode: 'open' });

    shadowRoot.append(tempEle.content);
    connect(store.appState, (value) => {
      shadowRoot.querySelector('#text').innerHTML = value.text;
    });
  }
}
customElements.define('app-toast', AppToast);

document.onclick = ({ timeStamp }) => {
  store.appState.toast = { text: timeStamp };
};
