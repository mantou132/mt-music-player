import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';
import { store } from '../../models/index.js';
import { upload } from '../../services/song.js';

export default class AppUpload extends Component {
  constructor() {
    super();
    this.state = store.playerState;
    this.changeHandle = this.changeHandle.bind(this);
    AppUpload.instance = this;
  }

  render() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>
      <input @change="${this.changeHandle}" type="file" multiple accept="audio/*">
    `;
  }

  click() {
    const input = this.shadowRoot.querySelector('input');
    input.click();
  }

  changeHandle() {
    const input = this.shadowRoot.querySelector('input');
    upload(input.files);
    input.value = '';
  }
}

customElements.define('app-upload', AppUpload);
