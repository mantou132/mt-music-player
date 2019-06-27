import { createStore, updateStore } from './store.js';
import storage from '../utils/storage.js';

const store = createStore({
  historyState: {
    // coupling `lib/history.js`, `lib/component.js`
    // {path, query, title, state}
    // state: {$key, $close, ...}
    list: [],
    currentIndex: -1,
  },
});

const colseHandleMap = new WeakMap();

const generateState = (data, close) => {
  if (data.$key) throw new Error('`$key` is not allowed');
  if (data.$close) throw new Error('`$close` is not allowed');

  const $key = performance.now();
  const state = {
    ...data,
    $key,
    $close: !!close,
  };
  colseHandleMap.set(state, close);
  return state;
};

const history = {
  historyState: store.historyState,
  forward() {
    window.history.forward();
  },

  back() {
    window.history.back();
  },

  /**
   * push history item
   * @param {Object} options
   * @param {String} options.path equivalent `location.pathname`
   * @param {String} options.query equivalent `location.search`
   * @param {String} options.title equivalent `document.title`
   * @param {Function} options.close back button callback function
   * @param {Object} options.data serializable object, equivalent `history.state`
   */
  push(options) {
    const { path, close } = options;
    const query = options.query || '';
    const data = options.data || {};
    const title = options.title || '';

    const { list, currentIndex } = store.historyState;
    const state = generateState(data, close);
    const historyItem = {
      state,
      title,
      path,
      query,
    };

    window.history.pushState(state, title, path + query);

    const newList = list.slice(0, currentIndex + 1).concat(historyItem);
    updateStore(store.historyState, {
      list: newList,
      currentIndex: newList.length - 1,
    });
  },

  replace(options) {
    const { path, close } = options;
    const query = options.query || '';
    const data = options.data || {};
    const title = options.title || '';

    const state = generateState(data, close);
    window.history.replaceState(state, title, path + query);

    const { list, currentIndex } = store.historyState;
    list.splice(currentIndex, 1, {
      path,
      query,
      state,
      title,
    });
    updateStore(store.historyState, {
      list,
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
    window.history.pushState(state, title, path + query);
    return;
  }

  const currentState = list[currentIndex];
  const newStateIndex = list.findIndex(
    historyState => historyState.state.$key === event.state.$key,
  );

  if (currentState.state.$close) {
    const closeHandle = colseHandleMap.get(currentState.state);
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
