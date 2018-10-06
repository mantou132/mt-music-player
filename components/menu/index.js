import { html } from 'https://dev.jspm.io/lit-html';
import { store } from '../../models/index.js';
import Component from '../index.js';

class AppMenu extends Component {
  constructor() {
    super();
    this.state = store.menuState;
    document.addEventListener('click', () => {
      this.setState({ isOpen: !this.state.isOpen });
    });
  }

  render() {
    return html`
      
    `;
  }
}
customElements.define('app-menu', AppMenu);
