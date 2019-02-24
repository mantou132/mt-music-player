import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { getSrc } from '../../utils/misc.js';
import { compressionImg } from '../../utils/canvas.js';
import mediaQuery from '../../lib/mediaquery.js';

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
      const file = input.files[0];
      if (this.limit) {
        compressionImg({ file }, this.limit).then((f) => {
          this.revokeURL();
          this.setState({
            file: f,
            blobUrl: URL.createObjectURL(f),
          });
        });
      } else {
        this.revokeURL();
        this.setState({
          file,
          blobUrl: URL.createObjectURL(file),
        });
      }
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
            display: flex;
            justify-content: center;
            align-items: center;
            background: #0008;
            color: #fff;
            font-size: 1.2rem;
            text-align: center;
          }
          @media ${mediaQuery.HOVER} {
            :host(:not(:hover)) .hint {
              display: none;
            }
          }
        </style>
        <input type="file" accept="image/*" @change="${this.changeHandle}" name="${name}" hidden>
        <img src="${getSrc(blobUrl || src)}">
        <div class="hint">change picture</div>
      `;
    }

    disconnected() {
      this.revokeURL();
    }
  },
);
