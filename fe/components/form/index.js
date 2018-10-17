import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';

customElements.define(
  'app-form',
  class extends Component {
    get value() {
      const elements = this.querySelectorAll('[name]');
      const formData = new FormData();
      elements.forEach((ele) => {
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
          }
        </style>
        <slot></slot>
      `;
    }
  },
);
