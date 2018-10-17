import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';

customElements.define(
  'app-form',
  class extends Component {
    get value() {
      const elements = this.querySelectorAll('[name]');
      const value = {};
      elements.forEach((ele) => {
        if ('value' in ele) {
          value[ele.getAttribute('name')] = ele.value;
        }
      });
      return value;
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
