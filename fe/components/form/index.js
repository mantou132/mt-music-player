import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';

import './button.js';
import './image.js';
import './text.js';

customElements.define(
  'app-form',
  class extends Component {
    get value() {
      const elements = this.querySelectorAll('[name]');
      const formData = new FormData();
      elements.forEach(ele => {
        if ('value' in ele) {
          formData.append(ele.getAttribute('name'), ele.value);
        }
      });
      return formData;
    }

    render() {
      return html`
        <style>
          :host {
            display: block;
            color: var(--form-text-primary-color);
          }
        </style>
        <slot></slot>
      `;
    }
  },
);
