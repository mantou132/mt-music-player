import { html } from '../../js_modules/lit-html.js';
import Component from '../../lib/component.js';
import { store, updateStore } from '../../models/index.js';

customElements.define(
  'player-volume',
  class extends Component {
    static observedStores = [store.playerState];

    changeHandle = ({ detail }) => {
      updateStore(store.playerState, {
        volume: detail / 100,
      });
    };

    clickHandle = () => {
      const { muted } = store.playerState;
      updateStore(store.playerState, {
        muted: !muted,
      });
    };

    render() {
      const { volume, muted } = store.playerState;
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
  },
);
