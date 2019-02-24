import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { getSrc } from '../../utils/misc.js';
import mediaQuery from '../../lib/mediaquery.js';

customElements.define(
  'gallery-item',
  class extends Component {
    static get observedAttributes() {
      return ['id', 'updatedat'];
    }

    render() {
      const { image, title, dec = '' } = this.data;
      return html`
        <style>
          :host {
            position: relative;
            text-align: center;
          }
          .image {
            position: relative;
          }
          .image::after {
            content: '';
            display: block;
            padding-bottom: 100%;
          }
          img {
            position: absolute;
            width: 100%;
            height: 100%;
            top: 0;
            left: 0;
            object-fit: cover;
          }
          .footer {
            padding: 1rem;
          }
          .title,
          .name {
            line-height: 1.3em;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
          @media ${mediaQuery.HOVER} {
            :host(:hover) {
              cursor: pointer;
            }
          }
          @media ${mediaQuery.PHONE} {
            .footer {
              padding: .4rem;
            }
          }
        </style>
        <div class="image">
          <img src="${getSrc(image)}">
        </div>
        <div class="footer">
          <div class="title">${title}</div>
          <div class="dec">${dec}</div>
        <div>
        <app-ripple type="touch"></app-ripple>
    `;
    }
  },
);
