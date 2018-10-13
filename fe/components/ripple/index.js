import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../index.js';

customElements.define(
  'app-ripple',
  class extends Component {
    constructor() {
      super();
      this.onclick = function ripple({ offsetX: x, offsetY: y }) {
        const start = performance.now();
        const raf = (now) => {
          const count = Math.floor(now - start);
          this.style.cssText = `
            --ripple-x: ${x};
            --ripple-y: ${y};
            --ripple-color: rgba(255,255,255,0.54);
            --animation-tick: ${count};
          `;
          if (count > 1000) {
            // this.style.cssText = '--animation-tick: 0';
            return;
          }
          requestAnimationFrame(raf);
        };
        requestAnimationFrame(raf);
      };
    }

    render() {
      return html`
        <style>
          :host {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-image: paint(ripple);
          }
        </style>
      `;
    }
  },
);
