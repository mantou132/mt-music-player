import { html } from '../../js_modules/lit-html.js';
import { store } from '../../models/index.js';
import Component from '../../lib/component.js';
import history from '../../lib/history.js';
import { isEqual } from '../../utils/object.js';

customElements.define(
  'app-link',
  class extends Component {
    constructor() {
      super();
      this.state = store.historyState;
      this.onclick = this.clickHandle.bind(this);
    }

    get active() {
      const path = this.getAttribute('path');
      const query = this.getAttribute('query') || '';

      const { list, currentIndex } = this.state;
      const currentState = list[currentIndex];
      if (
        isEqual(currentState, { path, query }, { ignores: ['state', 'title'] })
      ) {
        return true;
      }
      return false;
    }

    clickHandle() {
      const { $close } = window.history.state;
      const { title = this.getAttribute('title') || '' } = this.dataset;
      const path = this.getAttribute('path');
      const query = this.getAttribute('query') || '';
      if (!this.active) {
        if ($close) {
          history.back();
          setTimeout(() => {
            history.push({ title, path, query });
          }, 200);
        } else {
          history.push({ title, path, query });
        }
      }
    }

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
