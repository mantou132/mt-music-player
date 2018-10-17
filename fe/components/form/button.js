import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import '../ripple/index.js';

customElements.define(
  'form-button',
  class extends Component {
    static get observedAttributes() {
      return ['disabled', 'type'];
    }

    render() {
      const disabled = this.getAttribute('disabled');
      const type = this.getAttribute('type') || '';
      const color = type === 'secondary' ? '' : 'var(--theme-color)';

      return html`
        <style>
          :focus {
            outline: none;
          }
          button {
            position: relative;
            overflow: hidden;
            padding: 1em;
            border: none;
            border-radius: 2px;
            background: transparent;
            text-transform: uppercase;
            color: var(--theme-color);
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
          <app-ripple color="${color}"></app-ripple>
        </button>
      `;
    }
  },
);
