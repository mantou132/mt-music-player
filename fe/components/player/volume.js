import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import shortcut from '../../lib/shortcut.js';

customElements.define(
  'player-volume',
  class extends Component {
    constructor() {
      super();
      this.state = store.playerState;
      this.changeHandle = this.changeHandle.bind(this);
      this.clickHandle = this.clickHandle.bind(this);
      window.addEventListener('keydown', e => {
        const { volume } = this.state;
        if (shortcut(e, 'up')) {
          this.setState({
            volume: volume + 0.1 > 1 ? volume : volume + 0.1,
          });
        } else if (shortcut(e, 'down')) {
          this.setState({
            volume: volume - 0.1 < 0 ? 0 : volume - 0.1,
          });
        }
      });
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
        <app-range
          @change="${this.changeHandle}"
          value="${volume * 100}"
        ></app-range>
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
