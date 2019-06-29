import { connect, disconnect, STORE_MODULE_KEY } from './store.js';
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

const isMountedSymbol = Symbol('mounted');
const connectedStorePages = Symbol('connectedStorePages');
export default class Component extends HTMLElement {
  static observedAttributes; // string[]
  static observedPropertys; // string[]
  static observedStores; // story[]

  constructor() {
    super();
    this[connectedStorePages] = new Set();
    this.state = {};
    this.setState = this.setState.bind(this);
    this.willMount = this.willMount.bind(this);
    this.render = this.render.bind(this);
    this.mounted = this.mounted.bind(this);
    this.shouldUpdate = this.shouldUpdate.bind(this);
    this.update = this.update.bind(this);
    this.updated = this.updated.bind(this);
    this.disconnectStores = this.disconnectStores.bind(this);
    this.attributeChanged = this.attributeChanged.bind(this);
    this.unmounted = this.unmounted.bind(this);

    const { observedPropertys, observedStores } = this.constructor;
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
    if (observedStores) {
      observedStores.forEach(storeModule => {
        if (!storeModule[STORE_MODULE_KEY]) {
          throw new Error('`observedStores` only support store module');
        }

        connect(
          storeModule,
          this.update,
        );
        this[connectedStorePages].add(storeModule);
      });
    }
    this.attachShadow({ mode: 'open' });
  }

  /**
   * @readonly
   * update component
   * @param {object} payload Will be merged into the state object
   */
  setState(payload) {
    this.state = mergeObject(this.state, payload);
    this.update();
  }

  willMount() {}

  render() {
    return html``;
  }

  mounted() {}

  shouldUpdate() {
    return true;
  }

  /**
   * @readonly
   */
  update() {
    if (this.shouldUpdate()) {
      render(this.render(), this.shadowRoot);
      this.updated();
    }
  }

  updated() {}

  /**
   * @readonly
   */
  disconnectStores(storeModuleList) {
    storeModuleList.forEach(storeModule => {
      disconnect(storeModule, this.update);
    });
  }

  attributeChanged() {}
  unmounted() {}

  /**
   * the following is the webcomponets API native method
   */
  /**
   * @private
   * use `willMount` or `mounted`
   */
  connectedCallback() {
    this.willMount();
    render(this.render(), this.shadowRoot);
    this.mounted();
    this[isMountedSymbol] = true;
  }

  /**
   * @private
   * use `attributeChanged`
   */
  attributeChangedCallback(...rest) {
    if (this[isMountedSymbol]) {
      this.attributeChanged(...rest);
      this.update();
    }
  }

  // adoptedCallback() {}

  /**
   * @private
   * use `unmounted`
   */
  disconnectedCallback() {
    this[connectedStorePages].forEach(storeModule => {
      disconnect(storeModule, this.update);
    });
    this.unmounted();
    this[isMountedSymbol] = false;
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
  /**
   * @readonly
   */
  update() {
    renderTaskPool.add(() => {
      if (this.shouldUpdate()) {
        render(this.render(), this.shadowRoot);
        this.updated();
      }
    });
  }

  /**
   * async render
   * @private
   * use `willMount` or `mounted`
   */
  connectedCallback() {
    this.willMount();
    renderTaskPool.add(() => {
      render(this.render(), this.shadowRoot);
      this.mounted();
      this[isMountedSymbol] = true;
    });
  }
}
