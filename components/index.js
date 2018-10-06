import { html, render } from 'https://dev.jspm.io/lit-html';
import {
  store, connect, disConnect, PAGE_KEY,
} from '../models/index.js';
import { mergeObject } from '../utils/object.js';

const uniqueDataPropMap = new WeakMap();
const uniqueUpdatePropMap = new WeakMap();
const uniqueConnectedPageMap = new WeakMap();

export default class Component extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    uniqueDataPropMap.set(this, Symbol('data'));
    uniqueUpdatePropMap.set(this, Symbol('update'));
    uniqueConnectedPageMap.set(this, new Set());
  }

  get state() {
    const currentState = this[uniqueDataPropMap.get(this)];
    if (currentState[PAGE_KEY]) {
      return store[currentState[PAGE_KEY]];
    }
    return currentState;
  }

  set state(value) {
    if (typeof value !== 'object') throw new Error('Must use the object');
    if (!this[uniqueDataPropMap.get(this)]) {
      const update = () => render(this.render(), this.shadowRoot);
      this[uniqueUpdatePropMap.get(this)] = update;
      this[uniqueDataPropMap.get(this)] = value;
      const binding = (obj) => {
        if (obj[PAGE_KEY]) {
          connect(
            obj[PAGE_KEY],
            update,
          );
          uniqueConnectedPageMap.get(this).add(obj[PAGE_KEY]);
        } else {
          const keys = Object.keys(obj);
          keys.forEach((key) => {
            if (typeof obj[key] === 'object' && obj[key]) binding(obj[key]);
          });
        }
      };
      binding(value);
      return true;
    }
    throw new Error('Prohibit multiple direct assignments');
  }

  connectedCallback() {
    render(this.render(), this.shadowRoot);
  }

  disconnectedCallback() {
    uniqueConnectedPageMap.get(this).forEach((page) => {
      disConnect(page, this[uniqueUpdatePropMap.get(this)]);
    });
  }

  /**
   * update component
   * @param {object} payload Will be merged into the state object
   */
  setState(payload) {
    if (typeof payload !== 'object') throw new Error('Must use the object');
    let changeStore = false;
    if (this.state[PAGE_KEY]) {
      const page = this.state[PAGE_KEY];
      // Cannot be merged into new objects
      // Avoid `this.state` referencing obsolete objects
      store[page] = mergeObject(this.state, payload);
    } else {
      // Only support for `Store` one layer packaging
      // ✔ correct: `{<Store>}` or `store`
      // ✖ error: `{{<Store>}}`
      const keys = Object.keys(this.state);
      keys.forEach((key) => {
        const page = this.state[key][PAGE_KEY];
        if (!(key in payload)) return;
        if (page) {
          changeStore = true;
          store[page] = mergeObject(this.state[key], payload[key]);
        } else {
          this.state[key] = payload[key];
        }
      });
    }
    if (!changeStore) this[uniqueUpdatePropMap.get(this)]();
  }

  render() {
    return html``;
  }
}
