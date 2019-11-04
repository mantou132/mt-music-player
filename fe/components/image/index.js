/**
 * [x] Async render placeholder
 * * Lazy loading
 * [x] Aspect ratio
 */
import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { getSrc, getAbbrPinyin } from '../../utils/misc.js';
import { transformTextToSVG } from '../../utils/canvas.js';
import { htmlClass } from '../../utils/string.js';

const altPlaceholderMap = new Map();

export default class Image extends Component {
  static async getAltPlaceholder(alt = '') {
    if (!altPlaceholderMap.has(alt)) {
      altPlaceholderMap.set(
        alt,
        new Promise(async resolve => {
          resolve(transformTextToSVG(await getAbbrPinyin(alt)));
        }),
      );
    }
    return altPlaceholderMap.get(alt);
  }

  static observedAttributes = [
    'data-alt',
    'data-src',
    'data-aspect-ratio',
    'data-lazy',
    'data-fit',
  ];

  get img() {
    return this.shadowRoot.querySelector('img');
  }

  state = {
    altPlaceholder: null,
  };

  render() {
    const { aspectRatio = 1, fit = 'cover', src } = this.dataset;
    const { altPlaceholder } = this.state;
    const autoSizeClass = htmlClass({ autosize: aspectRatio === 'auto' });

    return html`
      <style>
        :host {
          display: block;
          position: relative;
          overflow: hidden;
          contain: content;
          font-size: 0;
        }
        .img {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          object-fit: ${fit};
          color: transparent;
        }
        .img.autosize {
          position: static;
        }
        .img::before {
          content: '';
          display: inline-block;
          width: 100%;
          height: 100%;
          background: var(--player-text-secondary-color) center no-repeat;
          background-size: contain;
        }
        .img:not([src])::before {
          visibility: hidden;
        }
        .dimension {
          width: 100%;
          padding-bottom: ${aspectRatio * 100}%;
        }
        .dimension.autosize {
          display: none;
        }
      </style>
      <img
        crossorigin="anonymous"
        alt=" "
        class="img ${autoSizeClass}"
        src="${getSrc(src || altPlaceholder)}"
      />
      <div class="dimension ${autoSizeClass}"></div>
    `;
  }

  async mounted() {
    const { alt, src } = this.dataset;
    if (!src) {
      this.setState({
        altPlaceholder: await Image.getAltPlaceholder(alt),
      });
    }
  }

  async attributeChanged(attr) {
    const { src, alt } = this.dataset;
    if (attr === 'data-alt' || attr === 'data-src') {
      // component is sync update !!!
      // if the dependency of `Image.getAltPlaceholder` is already loaded
      // will not cause redundant updates
      this.setState({
        altPlaceholder: src ? null : await Image.getAltPlaceholder(alt),
      });
    }
  }
}

customElements.define('app-img', Image);
