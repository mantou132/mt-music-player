import { html, render } from 'https://dev.jspm.io/lit-html';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import { secondToMinute } from '../../utils/datetime.js';
import AppMenu from '../menu/index.js';
import { del, update } from '../../services/song.js';
import Modal from '../modal/index.js';
import Confirm from '../confirm/index.js';
import { getSrc } from '../../utils/misc.js';

customElements.define(
  'list-item',
  class extends Component {
    static get observedAttributes() {
      return ['id', 'updatedat'];
    }

    constructor() {
      super();
      this.clickHandle = this.clickHandle.bind(this);
      this.editHandle = this.editHandle.bind(this);
      this.deleteHandle = this.deleteHandle.bind(this);
    }

    clickHandle(event) {
      this.classList.add('hover');
      AppMenu.open({
        list: [
          {
            text: 'edit',
            handle: this.editHandle,
          },
          {
            text: 'delete',
            handle: this.deleteHandle,
          },
        ],
        target: event.target,
        stage: this.getRootNode().host,
        onclose: () => this.classList.remove('hover'),
      });
      event.stopPropagation();
    }

    editHandle() {
      const { list } = store.songData;
      const song = list.find(e => String(e.id) === this.id);
      const form = document.createElement('app-form');
      render(
        html`
          <style>
            app-form {
              display: flex;
            }
            form-img {
              width: 10rem;
              height: 10rem;
              margin: 0 var(--modal-margin) var(--modal-margin) 0;
            }
            form-text {
              margin-bottom: 2em;
            }
            .text {
              flex-grow: 1;
            }
            @media (min-width: 20em) and (max-width: 30em) {
              app-form {
                flex-direction: column;
              }
            }
          </style>
          <form-img
            name="picture"
            src="${getSrc(song.picture)}">
          </form-img>
          <div class="text">
            <form-text label="title" name="title" value="${song.title || ''}"></form-text>
            <form-text label="artist" name="artist" value="${song.artist || ''}"></form-text>
            <form-text label="album" name="album" value="${song.album || ''}"></form-text>
          </div>
        `,
        form,
      );
      const oncomplete = () => {
        update(Number(this.id), form.value);
      };
      Modal.open({
        title: 'edit music info',
        complete: 'ok',
        cancel: 'cancel',
        template: form,
        oncomplete,
      });
    }

    deleteHandle() {
      Confirm.open({
        complete: 'confirm',
        cancel: 'cancel',
        text: 'delete song?',
        oncomplete: () => del(Number(this.id)),
      });
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
          :host([error]) {
            --list-item-playing-color: var(--error-color);
          }
          .info {
            flex-grow: 1;
            width: 0;
          }
          .title {
            color: var(--list-item-playing-color);
            fill: var(--list-item-playing-color);
          }
          ::slotted(app-icon:not([hidden])) {
            vertical-align: middle;
            margin: -.6rem 0 -.4rem -.5rem;
          }
          .title,
          .name {
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
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

          @media (min-width: 20em) and (max-width: 30em) {
            .more {
              display: block;
            }
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
