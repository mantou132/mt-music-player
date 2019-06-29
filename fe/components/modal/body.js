import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import mediaQuery from '../../lib/mediaquery.js';

customElements.define(
  'modal-body',
  class extends Component {
    static observedStores = [store.modalState];

    render() {
      const { template } = store.modalState;
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
