import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import mediaQuery from '../../lib/mediaquery.js';

customElements.define(
  'modal-body',
  class extends Component {
    constructor() {
      super();
      this.state = store.modalState;
    }

    render() {
      const { template } = this.state;
      return html`
        <style>
          @media ${mediaQuery.PHONE} {
            :host::-webkit-scrollbar {
              width: 0;
            }
            :host {
              scrollbar-width: none;
            }
          }
        </style>
        ${template}
      `;
    }
  },
);
