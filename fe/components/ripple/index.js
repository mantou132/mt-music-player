import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { isEqual } from '../../utils/object.js';

customElements.define(
  'app-ripple',
  class extends Component {
    constructor() {
      super();
      const type = this.getAttribute('type');
      this.timer = null;
      if (type === 'touch') {
        this.touchHandleTimer = null;
        this.ontouchstart = this.touchStartHandle;
        this.ontouchend = this.touchEndHandle;
      } else {
        this.onmousedown = this.mouseDownHandle;
      }
    }

    touchStartHandle({ targetTouches: [touche] }) {
      const { left, top } = this.getBoundingClientRect();
      const x = touche.clientX - left;
      const y = touche.clientY - top;

      const touchHandleTimer = setTimeout(() => {
        const { left: currentLeft, top: currentTop } = this.getBoundingClientRect();
        if (
          isEqual({ left: currentLeft, top: currentTop }, { left, top })
          && this.touchHandleTimer === touchHandleTimer
        ) {
          this.mouseDownHandle({ offsetX: x, offsetY: y });
        }
      }, 200);
      this.touchHandleTimer = touchHandleTimer;
    }

    touchEndHandle() {
      clearTimeout(this.touchHandleTimer);
      this.touchHandleTimer = null;
    }

    mouseDownHandle(event) {
      const { offsetX: x, offsetY: y } = event;
      const disabled = this.hasAttribute('disabled');
      if (disabled) return;

      const isCircle = this.hasAttribute('circle');

      const duration = parseInt(this.getAttribute('duration'), 10) || 600;
      const color = this.getAttribute('color') || window.getComputedStyle(this).color;
      const scale = this.getAttribute('scale') || (isCircle ? 1.5 : 1);
      const opacity = this.getAttribute('opacity') || 0.08;

      this.classList.add('animating');
      const { clientWidth, clientHeight } = this;
      const start = performance.now();
      cancelAnimationFrame(this.timer);
      const raf = (now) => {
        const count = Math.floor(now - start);
        this.style.cssText = `
          --ripple-x: ${isCircle ? clientWidth / 2 : x};
          --ripple-y: ${isCircle ? clientHeight / 2 : y};
          --ripple-color: ${color};
          --animation-tick: ${count};
          --animation-duration: ${duration};
          transform: scale(${scale});
          opacity: ${opacity};
        `;
        if (count > duration) {
          this.classList.remove('animating');
          this.style.cssText = '--animation-tick: 0';
          return;
        }
        this.timer = requestAnimationFrame(raf);
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
