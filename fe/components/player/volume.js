import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
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
            justify-content: flex-end;
            align-items: center;
          }
          app-icon {
            margin-right: 1.6rem;
          }
          app-range {
            max-width: 14.4rem;
            margin-right: 2.4rem;
            flex-shrink: 1;
            flex-grow: 1;
          }
        </style>
        <app-icon name="${icon}" @click="${this.clickHandle}">
          <app-ripple circle></app-ripple>
        </app-icon>
        <app-range @change="${this.changeHandle}" value="${volume * 100}"></app-range>
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
