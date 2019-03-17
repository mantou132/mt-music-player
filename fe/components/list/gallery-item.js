import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
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
              padding: 0.4rem;
            }
          }
        </style>
        <app-img data-src="${image || ''}" data-alt="${title}"></app-img>
        <div class="footer">
          <div class="title">${title}</div>
          <div class="dec">${dec}</div>
          <div>
            <app-ripple type="touch"></app-ripple>
          </div>
        </div>
      `;
    }
  },
);
