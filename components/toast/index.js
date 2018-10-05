import { html } from 'https://dev.jspm.io/lit-html';
import { store } from '../../models/index.js';
import Component from '../index.js';

let appToast;
class AppToast extends Component {
  constructor() {
    super();
    // data binding
    this.state = store.appState.toast;
    appToast = this;
  }

  render() {
    const { text } = this.state;
    return html`
      <style>
        :host {
          position: fixed;
          left: 1em;
          bottom: 1em;
        }
      </style>
      <span>${text}</span>
    `;
  }
}
customElements.define('app-toast', AppToast);

const update = () => setTimeout(() => {
  appToast.setState({
    text: new Date().toISOString(),
  });
  update();
}, 100);
update();
