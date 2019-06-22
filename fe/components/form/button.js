import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import mediaQuery from '../../lib/mediaquery.js';

customElements.define(
  'form-button',
  class extends Component {
    static observedAttributes = ['disabled', 'type'];

    render() {
      const disabled = this.getAttribute('disabled');
      const type = this.getAttribute('type') || '';

      return html`
        <style>
          :focus {
            outline: none;
          }
          button {
            position: relative;
            overflow: hidden;
            padding: 1rem;
            border: none;
            border-radius: 2px;
            background: transparent;
            text-transform: uppercase;
            color: var(--theme-color);
            font-size: 1.4rem;
            font-weight: 500;
          }
          button.secondary {
            color: var(--form-text-secondary-color);
          }
          button:disabled {
            cursor: not-allowed;
            color: var(--form-text-disabled-color);
          }
          @media ${mediaQuery.HOVER} {
            button:hover:not(:disabled) {
              background: var(--form-hover-background-color);
            }
          }
        </style>
        <button class="${type}" ?disabled="${disabled}">
          <slot></slot>
          <app-ripple type="touch" ?disabled="${disabled}"></app-ripple>
        </button>
      `;
    }
  },
);
