import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';

customElements.define(
  'app-ripple',
  class extends Component {
    constructor() {
      super();
      this.onmousedown = this.mouseDownHandle;
    }

    mouseDownHandle({ offsetX: x, offsetY: y }) {
      const isCircle = this.hasAttribute('circle');

      const duration = parseInt(this.getAttribute('duration'), 10) || 600;
      // currentColor?
      // https://github.com/servo/servo/pull/7120
      const color = this.getAttribute('color') || 'rgba(255,255,255,0.46)';
      const scale = this.getAttribute('scale') || 1;

      this.classList.add('animating');
      const { clientWidth, clientHeight } = this;
      const start = performance.now();
      const raf = (now) => {
        const count = Math.floor(now - start);
        this.style.cssText = `
          --ripple-x: ${isCircle ? clientWidth / 2 : x};
          --ripple-y: ${isCircle ? clientHeight / 2 : y};
          --ripple-color: ${color};
          --animation-tick: ${count};
          --animation-duration: ${duration};
          transform: scale(${scale});
        `;
        if (count > duration) {
          this.classList.remove('animating');
          this.style.cssText = '--animation-tick: 0';
          return;
        }
        requestAnimationFrame(raf);
      };
      requestAnimationFrame(raf);
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
