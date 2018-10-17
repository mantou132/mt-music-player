import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';

customElements.define(
  'form-text',
  class extends Component {
    static get observedAttributes() {
      return ['name', 'label', 'value', 'placeholder', 'disabled'];
    }

    get value() {
      return this.shadowRoot.querySelector('input').value;
    }

    set value(v) {
      this.shadowRoot.querySelector('input').value = v;
    }

    render() {
      const name = this.getAttribute('name');
      const label = this.getAttribute('label');
      const disabled = this.getAttribute('disabled');
      const value = this.getAttribute('value') || '';
      const placeholder = this.getAttribute('placeholder') || '';

      return html`
        <style>
          :focus {
            outline: none;
          }
          .wrap {
            position: relative;
            display: block;
            font-size: 1.6rem;
          }
          .wrap .label {
            font-size: .75em;
            color: var(--form-text-secondary-color);
            text-transform: capitalize;
          }
          input {
            display: block;
            box-sizing: border-box;
            width: 100%;
            margin-bottom: 2em;
            padding: .5em 0;
            border-width: 0 0 1px;
            border-color: var(--form-text-secondary-color);
            border-style: solid;
            color: var(--form-text-primary-color);
            font-size: inherit;
          }
          input + .border {
            pointer-events: none;
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: transparent;
            transform: scaleX(0);
            transition: transform .3s;
          }
          input:hover,
          input:focus {
            border-color: var(--theme-color);
          }
          input:focus + .border {
            background: var(--theme-color);
            transform: scaleX(1);
          }
        </style>
        <label class="wrap">
          <div class="label">${label}</div>
          <input
            name="${name}"
            type="text"
            value="${value}"
            placeholder="${placeholder}"
            ?disabled="${disabled}"
            spellcheck="false">
          <div class="border"></div>
        </label>
      `;
    }
  },
);
