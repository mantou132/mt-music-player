import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import history from '../../lib/history.js';
import { isEqual } from '../../utils/object.js';

customElements.define(
  'app-link',
  class extends Component {
    static observedStores = [history.historyState];

    constructor() {
      super();
      this.onclick = this.clickHandle;
    }

    get active() {
      const path = this.getAttribute('path');
      const query = this.getAttribute('query') || '';

      const { list, currentIndex } = history.historyState;
      const currentState = list[currentIndex];
      if (
        isEqual(currentState, { path, query }, { ignores: ['state', 'title'] })
      ) {
        return true;
      }
      return false;
    }

    clickHandle = () => {
      const { $close } = window.history.state;
      const path = this.getAttribute('path');
      const query = this.getAttribute('query') || '';
      if (!this.active) {
        if ($close) {
          history.back();
          setTimeout(() => {
            history.push({ path, query });
          }, 200);
        } else {
          history.push({ path, query });
        }
      }
    };

    render() {
      if (this.active) {
        this.setAttribute('active', '');
      } else {
        this.removeAttribute('active');
      }

      return html`
        <style>
          :host {
            display: contents;
          }
        </style>
        <slot></slot>
      `;
    }
  },
);
