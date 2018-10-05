import { html, render } from 'https://dev.jspm.io/lit-html';
import {
  connect, disConnect, parentKey, nameKey,
} from '../models/index.js';
import { mergeObject } from '../utils/object.js';

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
    if (typeof v !== 'object') throw new Error('Must use the object');
    if (!this[uniqueDataPropMap.get(this)]) {
      const update = () => {
        render(this.render(), this.shadowRoot);
      };
      this[uniqueUpdatePropMap.get(this)] = update;
      this[uniqueDataPropMap.get(this)] = v;
      const binding = (obj) => {
        if (obj[parentKey]) {
          connect(
            obj[parentKey],
            update,
          );
        } else {
          const keys = Object.keys(obj);
          keys.forEach((key) => {
            if (typeof obj[key] === 'object') binding(obj[key]);
          });
        }
      };
      binding(v);
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
    let changeStore = false;
    if (this.state[nameKey]) {
      changeStore = true;
      const name = this.state[nameKey];
      this.state[parentKey][name] = mergeObject(this.state[parentKey][name], payload);
      this[uniqueDataPropMap.get(this)] = this.state[parentKey][name];
    } else {
      // Only support for `Store` one layer packaging
      // ✔ correct: `{<Store>}` or `store`
      // ✖ error: `{{<Store>}}`
      const generateNewDateProp = (obj) => {
        const wrap = { ...obj };
        const keys = Object.keys(this.state);
        keys.forEach((key) => {
          const name = this.state[key][nameKey];
          if (!name) return;
          changeStore = true;
          const parent = this.state[key][parentKey];
          parent[name] = mergeObject(parent[name], obj[key]);
          wrap[key] = parent[name];
        });
        return wrap;
      };
      this[uniqueDataPropMap.get(this)] = generateNewDateProp(payload);
    }
    if (!changeStore) this[uniqueUpdatePropMap.get(this)]();
  }

  render() {
    return html``;
  }
}
