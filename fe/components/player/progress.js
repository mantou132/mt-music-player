import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import { secondToMinute } from '../../utils/datetime.js';
import mediaQuery from '../../lib/mediaquery.js';

customElements.define(
  'player-progress',
  class extends Component {
    constructor() {
      super();
      this.state = store.audioState;
      this.onclick = this.clickHandle.bind(this);
    }

    render() {
      const { currentTime, duration } = this.state;
      return html`
        <style>
          :host {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            height: 3px;
            margin-top: -3px;
            padding-top: 3px;
            padding-bottom: 3px;
          }
          .track {
            height: 100%;
          }
          .value {
            height: 100%;
            background: var(--theme-color);
          }
          .times {
            display: none;
          }
          @media ${mediaQuery.HOVER} {
            :host {
              cursor: pointer;
            }
          }
          @media ${mediaQuery.PHONE} {
            :host([maximize]) {
              position: static;
              width: calc(100vw - 3.2rem);
              margin: 1.125em auto;
            }
            :host([maximize]) .track {
              background: var(--player-text-secondary-color);
            }
            :host([maximize]) .times {
              display: flex;
              justify-content: space-between;
              margin-top: 0.5em;
              font-size: 0.75em;
            }
          }
          @media ${mediaQuery.SHORT} {
            :host {
              margin-left: 20vw;
            }
          }
        </style>
        <div class="track">
          <div
            class="value"
            style="width: ${(currentTime / duration).toFixed(4) * 100}%"
          ></div>
        </div>
        <div class="times">
          <span>${secondToMinute(currentTime)}</span>
          <span>${secondToMinute(duration)}</span>
        </div>
      `;
    }

    clickHandle({ x }) {
      const { duration } = this.state;
      const { left, width } = this.getBoundingClientRect();
      const nextTime = Math.floor(((x - left) * duration) / width);
      this.setState({
        currentTime: nextTime,
      });
    }
  },
);
