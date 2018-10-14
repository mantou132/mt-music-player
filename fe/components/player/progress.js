import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';

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
            width: 100%;
            height: 3px;
            margin-top: -3px;
            padding-top: 3px;
            padding-bottom: 3px;
            cursor: pointer;
          }
          div {
            height: 100%;
            background: var(--theme-color);
          }
        </style>
        <div style="width: ${(currentTime / duration).toFixed(4) * 100}%"></div>
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
