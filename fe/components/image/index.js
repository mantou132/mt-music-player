/**
 * * Placeholder
 * * Async render
 * * Lazy loading
 * [x] Aspect ratio
 */
import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { getSrc } from '../../utils/misc.js';
// import { transformTextToSVG } from '../../utils/canvas.js';

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

    render() {
      const { aspectRatio = 1, fit = 'cover', src } = this.dataset;

      return html`
        <style>
          :host {
            display: block;
            position: relative;
            overflow: hidden;
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
        </style>
        <img class="img" alt=" " src="${getSrc(src)}" />
        <div class="dimension"></div>
      `;
    }
  },
);
