import { createStore, updateStore } from './store.js';
import storage from '../utils/storage.js';

/**
 * toString method contains "?"
 */
export class QueryString extends URLSearchParams {
  constructor(param) {
    if (param instanceof QueryString) {
      return param;
    }
    if (typeof param === 'string') {
      super(param);
    } else {
      super();
      Object.keys(param).forEach(key => {
        this.append(key, param[key]);
      });
    }
  }

  concat(param) {
    let query;
    if (typeof param === 'string') {
      query = new URLSearchParams(param);
    } else {
      query = param;
    }
    Object.keys(query).forEach(key => {
      this.append(key, query[key]);
    });
  }

  toString() {
    const string = super.toString();
    return string ? `?${string}` : '';
  }

  toJSON() {
    return this.toString();
  }
}

const colseHandleMap = new WeakMap();
function generateState(data, close) {
  if (data.$key) throw new Error('`$key` is not allowed');
  if (data.$close) throw new Error('`$close` is not allowed');

  const state = {
    ...data,
    $key: Date.now() + performance.now(),
    $close: !!close,
  };
  colseHandleMap.set(state, close);
  return state;
}

/**
 * @typedef {Object} HistoryItemState
 * @property {boolean} $close
 * @property {number} $key
 */

/**
 * @typedef {Object} HistoryItem
 * @property {String} path window.location.pathname
 * @property {String|QueryString} query window.location.search
 * @property {String} title  window.document.title
 * @property {HistoryItemState} state window.history.state
 */

/**
 * @typedef {Object} NavigationParameter
 * @property {String} path
 * @property {String|QueryString} query
 * @property {String} title
 * @property {function} close
 * @property {object} data
 */

const initStore = {
  historyState: {
    /**
     * @type {HistoryItem[]}
     */
    list: [],
    currentIndex: -1,
  },
};

/**
 * @type {typeof initStore}
 */
const store = createStore(initStore);

const history = {
  historyState: store.historyState,
  basePath: '',

  get location() {
    const { list, currentIndex } = store.historyState;
    const location = list[currentIndex];
    // if (!location) return {};
    const query = new QueryString(location.query);
    return {
      path: location.path,
      query,
      state: location.state,
      title: location.title,
      href: location.path + query,
    };
  },

  forward() {
    window.history.forward();
  },

  back() {
    window.history.back();
  },

  /**
   * push history item
   * @param {NavigationParameter} options
   */
  push(options) {
    const { path, close } = options;
    const query = options.query || '';
    const title = options.title || '';
    const data = options.data || {};

    const state = generateState(data, close);

    window.history.pushState(
      state,
      title,
      history.basePath + path + new QueryString(query),
    );

    const { list, currentIndex } = store.historyState;
    const newList = list.slice(0, currentIndex + 1).concat({
      state,
      title,
      path,
      query,
    });
    updateStore(store.historyState, {
      list: newList,
      currentIndex: newList.length - 1,
    });
  },
  pushState(options) {
    const { path, query } = history.location;
    history.push({
      path,
      query,
      ...options,
    });
  },

  /**
   * push history item
   * @param {NavigationParameter} options
   */
  replace(options) {
    const { path, close } = options;
    const query = options.query || '';
    const data = options.data || {};
    const title = options.title || '';

    const state = generateState(data, close);

    window.history.replaceState(
      state,
      title,
      history.basePath + path + new QueryString(query),
    );

    const { list, currentIndex } = store.historyState;
    list.splice(currentIndex, 1, {
      state,
      title,
      path,
      query,
    });
    updateStore(store.historyState, {
      list,
    });
  },
  replaceState(options) {
    const { path, query } = history.location;
    history.replace({
      path,
      query,
      ...options,
    });
  },
};

if (!window.history.state) {
  // first time use app
  const { pathname, search } = window.location;
  history.push({ path: pathname, query: search });
} else if (window.history.state.$close) {
  // reload on page with modal window
  history.back();
}
updateStore(store.historyState, storage.getSession('historyState'));

window.addEventListener('unload', () => {
  storage.setSession('historyState', store.historyState);
});

window.addEventListener('popstate', event => {
  // forward or back
  // none replace

  // prev data
  const { list, currentIndex } = store.historyState;

  if (event.state === null) {
    const { state, title, path, query } = list[0];
    window.history.pushState(
      state,
      title,
      history.basePath + path + new QueryString(query),
    );
    return;
  }

  const { state } = list[currentIndex];
  const newStateIndex = list.findIndex(
    historyItem => historyItem.state.$key === event.state.$key,
  );

  if (state.$close) {
    const closeHandle = colseHandleMap.get(state);
    if (closeHandle) {
      // reason: back button close modal
      closeHandle();
    } else {
      // reason: reload modal
    }
  }

  updateStore(store.historyState, {
    currentIndex: newStateIndex,
  });
});

export default history;

// eslint-disable-next-line
window._history = history;
