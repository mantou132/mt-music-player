import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';

customElements.define(
  'modal-body',
  class extends Component {
    constructor() {
      super();
      this.state = store.modalState;
    }

    render() {
      const { template } = this.state;
      return html`${template}`;
    }
  },
);
