import { connect, disConnect, STORE, STORE_MODULE_KEY } from './store.js';
import { html, render } from '../js_modules/lit-html.js';
import { mergeObject } from '../utils/object.js';
import { Pool } from '../utils/misc.js';

// global component render task pool
const renderTaskPool = new Pool();
const exec = () =>
  window.requestAnimationFrame(function callback(timestamp) {
    const task = renderTaskPool.get();
    if (task) {
      task();
      if (performance.now() - timestamp < 16) {
        callback(timestamp);
        return;
      }
    }
    exec();
  });

exec();

// No longer enclosing the class, so private fields cannot be used
const isRenderedSymbol = Symbol('connected');
export default class Component extends HTMLElement {
  /**
   * @type {string[]}
   */
  static observedAttributes;

  /**
   * @type {string[]} simulation observedAttributes
   */
  static observedPropertys;

  #currentState;

  #connectedStorePages = new Set();

  constructor() {
    super();
    this.attachShadow({ mode: 'open' });

    const { observedPropertys } = this.constructor;
    if (observedPropertys) {
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

    // component build-in public method binding this
    this.setState = this.setState.bind(this);
    this.shouldUpdate = this.shouldUpdate.bind(this);
    this.update = this.update.bind(this);
    this.updated = this.updated.bind(this);
    this.connectStart = this.connectStart.bind(this);
    this.connected = this.connected.bind(this);
    this.disconnected = this.disconnected.bind(this);
    this.render = this.render.bind(this);
    this.attributeChanged = this.attributeChanged.bind(this);
  }

  get state() {
    return this.#currentState;
  }

  set state(value) {
    if (typeof value !== 'object') throw new Error('Must use the object');
    if (!this.#currentState) {
      this.#currentState = value;
      const binding = obj => {
        if (obj[STORE_MODULE_KEY]) {
          connect(
            obj,
            this.update,
          );
          this.#connectedStorePages.add(obj);
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

  /**
   * update component
   * @param {object} payload Will be merged into the state object
   */
  setState(payload) {
    if (typeof payload !== 'object') throw new Error('Must use the object');
    let changeStore = false;
    if (this.state[STORE_MODULE_KEY]) {
      const storeKey = this.state[STORE_MODULE_KEY];
      // Cannot be merged into new objects
      // Avoid `this.state` referencing obsolete objects
      this.state[STORE][storeKey] = mergeObject(this.state, payload);
    } else {
      // Only support for `Store` one layer packaging
      // ✔ correct: `{<Store>}` or `store`
      // ✖ error: `{{<Store>}}`
      const keys = Object.keys(this.state);
      keys.forEach(key => {
        const value = this.state[key];
        const storeKey = value && value[STORE_MODULE_KEY];
        if (!(key in payload)) return;
        if (storeKey) {
          changeStore = true;
          value[STORE][storeKey] = mergeObject(value, payload[key]);
        } else {
          this.state[key] = payload[key];
        }
      });
    }
    if (!changeStore) this.update();
  }

  shouldUpdate() {
    return true;
  }

  update() {
    if (this.shouldUpdate()) {
      render(this.render(), this.shadowRoot);
      this.updated();
    }
  }

  updated() {}

  connectStart() {}

  connected() {}

  /**
   * @private
   * use `connectStart` or `connected`
   */
  connectedCallback() {
    this.connectStart();
    render(this.render(), this.shadowRoot);
    this.connected();
    this[isRenderedSymbol] = true;
  }

  disconnected() {}

  /**
   * @private
   * use `disconnected`
   */
  disconnectedCallback() {
    this.#connectedStorePages.forEach(storeModule => {
      disConnect(storeModule, this.update);
    });
    this.disconnected();
    this[isRenderedSymbol] = false;
  }

  attributeChanged() {}

  /**
   * @private
   * use `attributeChanged`
   */
  attributeChangedCallback(...rest) {
    if (this[isRenderedSymbol]) {
      this.attributeChanged(...rest);
      this.update();
    }
  }

  render() {
    return html``;
  }
}

export class SingleInstanceComponent extends Component {
  /**
   * @type {SingleInstanceComponent}
   */
  static instance;

  constructor() {
    super();
    if (this.constructor.instance) {
      throw new Error('multiple instances are not allowed');
    } else {
      this.constructor.instance = this;
    }
  }
}

export class AsyncComponent extends Component {
  connectedCallback() {
    this.connectStart();
    renderTaskPool.add(() => {
      render(this.render(), this.shadowRoot);
      this.connected();
      this[isRenderedSymbol] = true;
    });
  }

  update() {
    renderTaskPool.add(() => {
      if (this.shouldUpdate()) {
        render(this.render(), this.shadowRoot);
        this.updated();
      }
    });
  }
}
