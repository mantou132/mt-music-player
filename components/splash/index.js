import '../../icons/icon.js';
import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';

class AppSplash extends Component {
  render() {
    return html`
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
  }
}
customElements.define('app-splash', AppSplash);
