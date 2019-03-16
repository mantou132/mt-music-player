import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { capitalize } from '../../utils/string.js';
import mediaQuery from '../../lib/mediaquery.js';
import routeMap from '../router/map.js';

customElements.define(
  'app-notfound',
  class extends Component {
    render() {
      return html`
        <style>
          :host {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: var(--notfound-text-secondary-color);
            fill: var(--notfound-text-secondary-color);
          }
          h1 {
            margin: 0.2em 0;
            font-size: 3em;
            font-weight: 500;
            text-transform: uppercase;
          }
          app-link {
            color: var(--notfound-text-primary-color);
          }
          app-link span {
            border-bottom: 1px solid transparent;
          }
          @media ${mediaQuery.HOVER} {
            app-link span:hover {
              cursor: pointer;
              border-color: currentColor;
            }
          }
        </style>
        <h1>not found</h1>
        <app-link
          path="${routeMap.HOME.path}"
          data-title="${routeMap.SONGS.title}"
          title="go homepage"
        >
          <span>${capitalize('go homepage')}</span>
        </app-link>
      `;
    }
  },
);
