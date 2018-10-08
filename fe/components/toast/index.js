import { html } from 'https://dev.jspm.io/lit-html';
import { store } from '../../models/index.js';
import Component from '../index.js';

let appToast;
class AppToast extends Component {
  constructor() {
    super();
    this.state = {
      self: { currentState: true },
      toastState: store.toastState,
      menuState: store.menuState,
    };
    appToast = this;
  }

  render() {
    const {
      self: { currentState },
      toastState: { text, type },
      menuState: { isOpen },
    } = this.state;
    return html`
      <style>
        :host {
          background: var(--toast-background-color);
          color: var(--toast-text-color);
          opacity: .5;
          display: ${isOpen ? 'block' : 'none'};
        }
      </style>
      <div>${type}</div>
      <div>${text}</div>
      <div>currentState: ${currentState}</div>
    `;
  }
}
customElements.define('app-toast', AppToast);

// test
const update = () => requestAnimationFrame(() => {
  if (appToast.state.menuState.isOpen) {
    appToast.setState({
      toastState: { text: new Date().toISOString(), type: Math.random() },
      self: { currentState: Math.random() > 0.5 },
    });
  }
  update();
}, 1000);
update();
