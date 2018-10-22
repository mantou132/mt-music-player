import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';

customElements.define(
  'form-button',
  class extends Component {
    static get observedAttributes() {
      return ['disabled', 'type'];
    }

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
            font-weight: bolder;
          }
          button.secondary {
            color: var(--form-text-secondary-color);
          }
          button:disabled {
            cursor: not-allowed;
            color: var(--form-text-disabled-color);
          }
          button:hover:not(:disabled) {
            background: var(--form-hover-background-color);
          }
        </style>
        <button class="${type}" ?disabled="${disabled}">
          <slot></slot>
          <app-ripple ?disabled="${disabled}"></app-ripple>
        </button>
      `;
    }
  },
);
