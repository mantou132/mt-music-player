import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';

customElements.define(
  'app-range',
  class extends Component {
    static get observedAttributes() {
      return ['value'];
    }

    constructor() {
      super();
      this.clickHandle = this.clickHandle.bind(this);
    }

    render() {
      const value = this.getAttribute('value');

      return html`
        <style>
          :host {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
          }
          .track {
            width: 100%;
            height: 2px;
            padding: calc((1em - 2px) / 2) 0;
            background: var(--player-text-secondary-color);
            background-clip: content-box;
          }
          .value {
            position: relative;
            height: 100%;
            background: currentColor;
          }
          .dot {
            position: absolute;
            top: 50%;
            right: 0;
            width: .75em;
            height: .75em;
            border-radius: 100%;
            background: currentColor;
            transform: translate(50%, -50%);
          }
        </style>
        <div class="track" @click="${this.clickHandle}">
          <div class="value" style="width: ${value}%">
            <div class="dot"></div>
          </div>
        </div>
    `;
    }

    clickHandle({ x }) {
      const { left, width } = this.getBoundingClientRect();
      const nextValue = Math.floor(((x - left) * 100) / width);
      this.setAttribute('value', nextValue);
      this.dispatchEvent(new CustomEvent('change', { detail: nextValue }));
    }
  },
);
