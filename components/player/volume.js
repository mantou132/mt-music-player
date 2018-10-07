import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';
import '../range/index.js';
import { store } from '../../models/index.js';

customElements.define(
  'player-volume',
  class extends Component {
    constructor() {
      super();
      this.state = store.playerState;
      this.changeHandle = this.changeHandle.bind(this);
      this.clickHandle = this.clickHandle.bind(this);
    }

    render() {
      const { volume, muted } = this.state;
      let icon;
      if (volume === 0 || muted) {
        icon = 'volume-off';
      } else if (volume < 0.3) {
        icon = 'volume-mute';
      } else if (volume < 0.66) {
        icon = 'volume-down';
      } else {
        icon = 'volume-up';
      }
      return html`
        <style>
          :host {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
          }
          app-icon {
            margin-right: 1.6rem;
          }
          app-range {
            width: 14.4rem;
            margin-right: 2.4rem;
          }
        </style>
        <app-range @change="${this.changeHandle}" value="${volume * 100}"></app-range>
        <app-icon name="${icon}" @click="${this.clickHandle}"></app-icon>
    `;
    }

    changeHandle({ detail }) {
      this.setState({
        volume: detail / 100,
      });
    }

    clickHandle() {
      const { muted } = this.state;
      this.setState({
        muted: !muted,
      });
    }
  },
);
