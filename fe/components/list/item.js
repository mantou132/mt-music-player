import { html } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import { secondToMinute } from '../../utils/datetime.js';
import AppMenu from '../menu/index.js';
import { del } from '../../services/song.js';
import '../ripple/index.js';

customElements.define(
  'list-item',
  class extends Component {
    static get observedAttributes() {
      return ['id'];
    }

    constructor() {
      super();
      this.clickHandle = this.clickHandle.bind(this);
    }

    clickHandle(e) {
      const { x, y } = e;
      this.classList.add('hover');
      AppMenu.instance.setState({
        position: { x, y },
        list: [
          {
            text: 'edit',
            handle: console.log,
          },
          {
            text: 'delete',
            handle: () => del(Number(this.id)),
          },
        ],
        closeCallback: () => this.classList.remove('hover'),
      });
      e.stopPropagation();
    }

    render() {
      const { list } = store.songData;
      const song = list.find(e => String(e.id) === this.id) || {};
      return html`
        <style>
          :host {
            display: flex;
            transition: background-color .3s;
          }
          :host(:hover),
          :host(.hover) {
            background: var(--list-hover-background-color);
          }
          :host([active]) {
            --list-item-playing-color: var(--theme-color);
          }
          .info {
            flex-grow: 1;
          }
          .title {
            color: var(--list-item-playing-color);
            fill: var(--list-item-playing-color);
          }
          ::slotted(app-icon:not([hidden])) {
            vertical-align: middle;
            margin: -.6rem 0 -.4rem -.5rem;
          }
          .name {
            margin-top: .25em;
          }
          .name:blank {
            display: none;
          }
          .name,
          .duration {
            font-size: .875em;
            color: var(--list-text-secondary-color);
          }
          .more {
            display: none;
          }
          :host(:hover) .more,
          :host(.hover) .more {
            display: block;
          }
          .more app-icon {
            margin-top: -.2rem;
          }
          .more,
          .duration {
            min-width: 4rem;
            padding-left: .75rem;
            text-align: right;
          }
          .duration {
            padding-top: .125em;
            color: var(--list-item-playing-color);
          }
        </style>
        <div class="info">
          <div class="title">
            <slot></slot>
            ${song.title}
          </div>
          <div class="name">${song.artist || 'unknown'}</div>
        </div>
        <div class="more">
          <app-icon @click="${this.clickHandle}" name="more-horiz">
            <app-ripple circle></app-ripple>
          </app-icon>
        </div>
        <div class="duration">
          ${secondToMinute(song.duration)}
        </div>
    `;
    }
  },
);
