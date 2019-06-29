import { html } from '../../js_modules/lit-html.js';
import { SingleInstanceComponent } from '../../lib/component.js';
import { store } from '../../models/index.js';
import { upload } from '../../services/song.js';

export default class AppUpload extends SingleInstanceComponent {
  static open() {
    const input = AppUpload.instance.shadowRoot.querySelector('input');
    input.click();
  }

  static observedStores = [store.playerState];

  changeHandle = () => {
    const input = this.shadowRoot.querySelector('input');
    upload(input.files);
    input.value = '';
  };

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
}

customElements.define('app-upload', AppUpload);
