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
      document.addEventListener('mousemove', () => {
        this.setState({
          volume: Math.random() * 100,
        });
      });
    }

    render() {
      const { volume } = this.state;
      return html`
        <style>
          :host {
            display: flex;
            flex-direction: row-reverse;
            align-items: center;
          }
        </style>
        <app-range value="${volume}"></app-range>
        <app-icon name="volume-down"></app-icon>
    `;
    }
  },
);
