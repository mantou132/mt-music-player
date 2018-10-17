import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';

customElements.define(
  'form-img',
  class extends Component {
    static get observedAttributes() {
      return ['name'];
    }

    get value() {
      return this.state.file;
    }

    constructor() {
      super();
      this.onclick = this.clickHandle.bind(this);
      this.changeHandle = this.changeHandle.bind(this);
      this.state = {
        file: null,
        blobUrl: '',
      };
    }

    clickHandle() {
      const input = this.shadowRoot.querySelector('input');
      input.click();
    }

    changeHandle() {
      const input = this.shadowRoot.querySelector('input');
      this.revokeURL();
      const file = input.files[0];
      this.setState({
        file,
        blobUrl: URL.createObjectURL(file),
      });
      input.value = '';
    }

    revokeURL() {
      const { blobUrl } = this.state;
      if (blobUrl) {
        URL.revokeObjectURL(blobUrl);
      }
    }

    render() {
      const { blobUrl } = this.state;
      const name = this.getAttribute('name');
      const src = this.getAttribute('src');

      return html`
        <style>
          :host {
            position: relative;
            display: block;
          }
          :host(:hover) .hint {
            display: flex;
            justify-content: center;
            align-items: center;
          }
          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
          }
          .hint {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            display: none;
            background: #0008;
            color: #fff;
            font-size: 1.2rem;
            text-align: center;
          }
        </style>
        <input type="file" accept="image/*" @change="${this.changeHandle}" name="${name}" hidden>
        <img src="${blobUrl || src || ''}">
        <div class="hint">change picture</div>
      `;
    }

    disconnected() {
      this.revokeURL();
    }
  },
);
