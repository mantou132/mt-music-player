import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { throttle } from '../../utils/misc.js';
import { htmlClass } from '../../utils/string.js';

customElements.define(
  'form-text',
  class extends Component {
    static observedAttributes = [
      'name',
      'label',
      'value',
      'placeholder',
      'disabled',
      'autofocus',
    ];

    constructor() {
      super();
      this.isComposition = false;
      this.inputHandle = this.inputHandle.bind(this);
      this.compositionHandle = this.compositionHandle.bind(this);
      this.state = {
        isStartedInput: false,
      };
    }

    get input() {
      return this.shadowRoot.querySelector('input');
    }

    get value() {
      return this.input.value;
    }

    set value(v) {
      this.input.value = v;
    }

    get validity() {
      this.setStartedInput();
      return this.input.validity;
    }

    setStartedInput() {
      const { isStartedInput } = this.state;
      if (!isStartedInput) {
        this.setState({ isStartedInput: true });
      }
    }

    inputHandle() {
      this.setStartedInput();
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
      const pattern = this.getAttribute('pattern') || '.*';
      const value = this.getAttribute('value') || '';
      const placeholder = this.getAttribute('placeholder') || '';

      const required = this.hasAttribute('required');
      const disabled = this.hasAttribute('disabled');

      const { isStartedInput } = this.state;
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
            font-size: 0.75em;
            color: var(--form-text-secondary-color);
            text-transform: capitalize;
          }
          input {
            display: block;
            box-sizing: border-box;
            width: 100%;
            padding: 0.5em 0;
            border-width: 0 0 1px;
            border-color: var(--form-text-secondary-color);
            border-style: solid;
            background: transparent;
            color: inherit;
            caret-color: var(--theme-color);
            font-size: inherit;
            border-radius: 0;
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
            transition: transform 0.3s;
          }
          input:hover,
          input:focus {
            border-color: var(--theme-color);
          }
          input:focus + .border {
            background: var(--theme-color);
            transform: scaleX(1);
          }
          input.started-input:invalid {
            border-color: var(--theme-error-color);
          }
          input.started-input:invalid + .border {
            background: var(--theme-error-color);
          }
        </style>
        <label class="wrap">
          <div class="label" ?hidden="${!label}">${label}</div>
          <input
            class="${htmlClass({ startedInput: isStartedInput })}"
            type="text"
            name="${name}"
            value="${value}"
            pattern="${pattern}"
            placeholder="${placeholder}"
            ?required="${required}"
            ?disabled="${disabled}"
            autocomplete="off"
            @input="${throttle(this.inputHandle, 1000)}"
            @compositionstart="${this.compositionHandle}"
            @compositionupdate="${this.compositionHandle}"
            @compositionend="${this.compositionHandle}"
            spellcheck="false"
          />
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
      this.input.focus();
    }
  },
);
