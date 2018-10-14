import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';

customElements.define(
  'app-ripple',
  class extends Component {
    constructor() {
      super();
      this.onclick = function ripple({ offsetX: x, offsetY: y }) {
        const isCircle = this.hasAttribute('circle');
        const duration = parseInt(this.getAttribute('duration'), 10) || 600;

        this.classList.add('animating');
        const { clientWidth, clientHeight } = this;
        const start = performance.now();
        const raf = (now) => {
          const count = Math.floor(now - start);
          this.style.cssText = `
            --ripple-x: ${isCircle ? clientWidth / 2 : x};
            --ripple-y: ${isCircle ? clientHeight / 2 : y};
            --ripple-color: rgba(255,255,255,0.54);
            --animation-tick: ${count};
            --animation-duration: ${duration};
          `;
          if (count > duration) {
            this.classList.remove('animating');
            this.style.cssText = '--animation-tick: 0';
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
          }
          :host(.animating) {
            background-image: paint(ripple);
          }
          :host([circle]) {
            border-radius: 100vw;
          }
        </style>
      `;
    }
  },
);
