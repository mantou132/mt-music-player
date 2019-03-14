import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import { upload } from '../../services/song.js';

export default class AppUpload extends Component {
  static open() {
    const input = AppUpload.instance.shadowRoot.querySelector('input');
    input.click();
  }

  constructor() {
    super();
    this.state = store.playerState;
    this.changeHandle = this.changeHandle.bind(this);
  }

  render() {
    return html`
      <style>
        :host {
          display: none;
        }
      </style>
      <input
        @change="${this.changeHandle}"
        type="file"
        multiple
        accept="audio/*"
      />
    `;
  }

  changeHandle() {
    const input = this.shadowRoot.querySelector('input');
    upload(input.files);
    input.value = '';
  }
}

customElements.define('app-upload', AppUpload);
