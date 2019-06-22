import { html } from '../../js_modules/lit-html.js';
import { AsyncComponent } from '../../lib/component.js';
import mediaQuery from '../../lib/mediaquery.js';
import history from '../../lib/history.js';

customElements.define(
  'gallery-item',
  class extends AsyncComponent {
    static observedAttributes = ['id', 'updatedat'];

    constructor() {
      super();
      this.onClick = this.onClick.bind(this);
    }

    onClick() {
      if (this.link) {
        history.push(this.link);
      }
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
        </div>
        <app-ripple @click="${this.onClick}" type="touch"></app-ripple>
      `;
    }
  },
);
