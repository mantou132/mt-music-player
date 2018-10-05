import { html, render } from 'https://dev.jspm.io/lit-html';
import {
  connect, disConnect, parentKey, nameKey,
} from '../models/index.js';

const uniqueDataPropMap = new WeakMap();
const uniqueUpdatePropMap = new WeakMap();

export default class Component extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    uniqueDataPropMap.set(this, Symbol('data'));
    uniqueUpdatePropMap.set(this, Symbol('update'));
  }

  get state() {
    return this[uniqueDataPropMap.get(this)];
  }

  set state(v) {
    if (typeof v !== 'object') throw new Error('Must use the `Store` object');
    if (!this[uniqueDataPropMap.get(this)]) {
      const update = () => {
        render(this.render(), this.shadowRoot);
      };
      this[uniqueDataPropMap.get(this)] = v;
      this[uniqueUpdatePropMap.get(this)] = update;
      connect(v[parentKey], update);
      return true;
    }
    return false;
  }

  connectedCallback() {
    render(this.render(), this.shadowRoot);
  }

  disconnectedCallback() {
    disConnect(this.state[parentKey], this[uniqueUpdatePropMap.get(this)]);
  }

  setState(payload) {
    if (typeof payload !== 'object') throw new Error('Must use the object');
    const name = this.state[nameKey];
    this.state[parentKey][name] = {
      ...this.state[parentKey][name],
      ...payload,
    };
    this[uniqueDataPropMap.get(this)] = this.state[parentKey][name];
  }

  render() {
    return html``;
  }
}
