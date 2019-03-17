import { html, render } from '../js_modules/lit-html.js';
import { store, connect, disConnect, PAGE_KEY } from '../models/index.js';
import { mergeObject } from '../utils/object.js';

const uniqueDataPropMap = new WeakMap();
const uniqueConnectedPageMap = new WeakMap();
const instanceSymbol = Symbol('instance');
const readyUpdateSymbol = Symbol('readyUpdate');
const connectedSymbol = Symbol('connected');

export default class Component extends HTMLElement {
  static get instance() {
    return this[instanceSymbol];
  }

  static set instance(lastInstance) {
    this[instanceSymbol] = lastInstance;
  }

  static get observedAttributes() {
    return [];
  }

  static get observedPropertys() {
    return [];
  }

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });
    uniqueDataPropMap.set(this, Symbol('data'));
    uniqueConnectedPageMap.set(this, new Set());

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.connected = this.connected.bind(this);
    this.disconnected = this.disconnected.bind(this);
    this.attributeChanged = this.attributeChanged.bind(this);
    this.setState = this.setState.bind(this);

    this.constructor.instance = this;
    const { observedPropertys } = this.constructor;
    observedPropertys.forEach(prop => {
      let propValue;
      Object.defineProperty(this, prop, {
        get() {
          return propValue;
        },
        set(v) {
          if (v !== propValue) {
            propValue = v;
            this.update();
          }
        },
      });
    });
  }

  get state() {
    const currentState = this[uniqueDataPropMap.get(this)];
    if (currentState && currentState[PAGE_KEY]) {
      return store[currentState[PAGE_KEY]];
    }
    return currentState;
  }

  set state(value) {
    if (typeof value !== 'object') throw new Error('Must use the object');
    if (!this[uniqueDataPropMap.get(this)]) {
      this[uniqueDataPropMap.get(this)] = value;
      const binding = obj => {
        if (obj[PAGE_KEY]) {
          connect(
            obj[PAGE_KEY],
            this.update,
          );
          uniqueConnectedPageMap.get(this).add(obj[PAGE_KEY]);
        } else {
          const keys = Object.keys(obj);
          keys.forEach(key => {
            if (typeof obj[key] === 'object' && obj[key]) binding(obj[key]);
          });
        }
      };
      binding(value);
      return true;
    }
    throw new Error('Prohibit multiple direct assignments');
  }

  shouldUpdate() {
    return true;
  }

  update() {
    if (this.shouldUpdate()) {
      if (this[readyUpdateSymbol]) {
        window.cancelAnimationFrame(this[readyUpdateSymbol]);
      }
      this[readyUpdateSymbol] = window.requestAnimationFrame(() => {
        render(this.render(), this.shadowRoot);
        this.updated();
      });
    }
  }

  updated() {}

  connectStart() {}

  connected() {}

  connectedCallback() {
    this.connectStart();
    render(this.render(), this.shadowRoot);
    this.connected();
    this[connectedSymbol] = true;
  }

  disconnected() {}

  disconnectedCallback() {
    uniqueConnectedPageMap.get(this).forEach(page => {
      disConnect(page, this.update);
    });
    this.disconnected();
    this[connectedSymbol] = false;
  }

  attributeChanged() {}

  attributeChangedCallback(...rest) {
    if (this[connectedSymbol]) {
      this.attributeChanged(...rest);
      this.update();
    }
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
      keys.forEach(key => {
        const value = this.state[key];
        const page = value && value[PAGE_KEY];
        if (!(key in payload)) return;
        if (page) {
          changeStore = true;
          store[page] = mergeObject(value, payload[key]);
        } else {
          this.state[key] = payload[key];
        }
      });
    }
    if (!changeStore) this.update();
  }

  render() {
    return html``;
  }
}
