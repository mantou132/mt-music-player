/**
 * [x] Async render placeholder
 * * Lazy loading
 * [x] Aspect ratio
 */
import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { getSrc, getPinYin } from '../../utils/misc.js';
import { transformTextToSVG } from '../../utils/canvas.js';
import { htmlClass } from '../../utils/string.js';

const altPlaceholderMap = new Map();

const getAltPlaceholder = async (alt = '') => {
  if (!altPlaceholderMap.has(alt)) {
    const altAbbr = (await getPinYin(alt)).substr(0, 2).toUpperCase();
    altPlaceholderMap.set(alt, transformTextToSVG(altAbbr));
  }
  return altPlaceholderMap.get(alt);
};

customElements.define(
  'app-img',
  class extends Component {
    static get observedAttributes() {
      return [
        'data-alt',
        'data-src',
        'data-aspect-ratio',
        'data-lazy',
        'data-fit',
      ];
    }

    constructor() {
      super();
      this.state = {
        altPlaceholder: null,
      };
    }

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
          alt=" "
          class="img ${autoSizeClass}"
          src="${getSrc(src || altPlaceholder)}"
        />
        <div class="dimension ${autoSizeClass}"></div>
      `;
    }

    async connected() {
      const { alt, src } = this.dataset;
      if (!src) {
        this.setState({
          altPlaceholder: await getAltPlaceholder(alt),
        });
      }
    }

    async attributeChanged(attr) {
      const { src, alt } = this.dataset;
      if (attr === 'data-alt' || attr === 'data-src') {
        // component is sync update !!!
        // if the dependency of `getAltPlaceholder` is already loaded
        // will not cause redundant updates
        this.setState({
          altPlaceholder: src ? null : await getAltPlaceholder(alt),
        });
      }
    }
  },
);
