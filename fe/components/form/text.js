import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { throttle } from '../../utils/misc.js';

customElements.define(
  'form-text',
  class extends Component {
    static get observedAttributes() {
      return ['name', 'label', 'value', 'placeholder', 'disabled', 'autofocus'];
    }

    constructor() {
      super();
      this.isComposition = false;
      this.inputHandle = this.inputHandle.bind(this);
      this.compositionHandle = this.compositionHandle.bind(this);
    }

    get value() {
      return this.shadowRoot.querySelector('input').value;
    }

    set value(v) {
      this.shadowRoot.querySelector('input').value = v;
    }

    inputHandle() {
      if (!this.isComposition) {
        this.dispatchEvent(new CustomEvent('change', { detail: this.value }));
      }
    }

    compositionHandle({ type }) {
      this.isComposition = type !== 'compositionend';
    }

    render() {
      const name = this.getAttribute('name');
      const label = this.getAttribute('label');
      const value = this.getAttribute('value') || '';
      const placeholder = this.getAttribute('placeholder') || '';

      const disabled = this.hasAttribute('disabled');

      return html`
        <style>
          :host(:not([hidden])) {
            display: block;
            flex-grow: 1;
          }
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
            padding: .5em 0;
            border-width: 0 0 1px;
            border-color: var(--form-text-secondary-color);
            border-style: solid;
            background: transparent;
            color: inherit;
            caret-color: var(--theme-color);
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
          <div class="label" ?hidden="${label}">${label}</div>
          <input
            name="${name}"
            type="text"
            value="${value}"
            placeholder="${placeholder}"
            autocomplete="off"
            @input="${throttle(this.inputHandle, 1000)}"
            @compositionstart="${this.compositionHandle}"
            @compositionupdate="${this.compositionHandle}"
            @compositionend="${this.compositionHandle}"
            ?disabled="${disabled}"
            spellcheck="false">
          <div class="border"></div>
        </label>
      `;
    }

    connected() {
      const autofocus = this.hasAttribute('autofocus');
      if (autofocus) {
        this.focus();
      }
    }

    focus() {
      this.shadowRoot.querySelector('input').focus();
    }
  },
);
