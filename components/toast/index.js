import { html } from 'https://dev.jspm.io/lit-html';
import { store } from '../../models/index.js';
import Component from '../index.js';

let appToast;
class AppToast extends Component {
  constructor() {
    super();
    // data binding
    this.state = {
      self: { currentState: true },
      menu: store.appState.menu,
      toast: store.appState.toast,
    };
    appToast = this;
  }

  render() {
    const {
      self: { currentState },
      toast: { text, type },
      menu: { isOpen },
    } = this.state;
    return html`
      <style>
        :host {
          position: fixed;
          left: 1em;
          bottom: 1em;
        }
      </style>
      <div>${type}</div>
      <div>${text}</div>
      <div>isOpen: ${isOpen}</div>
      <div>currentState: ${currentState}</div>
    `;
  }
}
customElements.define('app-toast', AppToast);

const update = () => requestAnimationFrame(() => {
  appToast.setState({
    toast: { text: new Date().toISOString(), type: Math.random() },
    menu: { isOpen: Math.random() > 0.5 },
    self: { currentState: Math.random() > 0.5 },
  });
  update();
}, 100);
update();
