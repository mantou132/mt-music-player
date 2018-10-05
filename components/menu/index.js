import { html } from 'https://dev.jspm.io/lit-html';
import { store } from '../../models/index.js';
import Component from '../index.js';

class AppMenu extends Component {
  constructor() {
    super();
    this.state = store.appState.menu;
    document.addEventListener('click', () => {
      this.setState({
        isOpen: !this.state.isOpen,
      });
    });
  }

  render() {
    return html`
      <style>
        :host {
          position: fixed;
          left: 1em;
          bottom: 1em;
        }
      </style>
      
    `;
  }
}
customElements.define('app-menu', AppMenu);
