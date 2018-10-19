import { store, updateStore } from '../models/index.js';
import storage from '../utils/storage.js';
import { isEqual } from '../utils/object.js';

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
  forward() {
    window.history.forward();
  },

  back() {
    window.history.back();
  },

  push(options) {
    const { path, close } = options;
    const query = options.query || '';
    const data = options.data || {};
    const title = options.title || document.title;

    const { list, currentIndex } = store.historyState;
    const state = generateState(data, close);
    const historyItem = {
      state,
      title,
      path,
      query,
    };

    // same router
    if (isEqual(historyItem, list[currentIndex], { ignores: ['$key'] })) {
      updateStore('historyState', {});
      return;
    }

    window.history.pushState(state, title, path + query);

    const newList = list.slice(0, currentIndex + 1).concat(historyItem);
    updateStore('historyState', {
      list: newList,
      currentIndex: newList.length - 1,
    });

    document.title = title;
  },

  replace(options) {
    const { path, close } = options;
    const query = options.query || '';
    const data = options.data || {};
    const title = options.title || document.title;

    const state = generateState(data, close);
    window.history.replaceState(state, title, path + query);

    const { list, currentIndex } = store.historyState;
    list.splice(currentIndex, 1, {
      path,
      query,
      state,
      title,
    });
    updateStore('historyState', {
      list,
    });

    document.title = title;
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

updateStore('historyState', storage.getSession('historyState'));
window.addEventListener('unload', () => {
  storage.setSession('historyState', store.historyState);
});

window.addEventListener('popstate', (event) => {
  // forward or back
  // none replace

  // prev data
  const { list, currentIndex } = store.historyState;

  if (event.state === null) {
    const {
      state, title, path, query,
    } = list[0];
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
  updateStore('historyState', {
    currentIndex: newStateIndex,
  });
});

export default history;

// eslint-disable-next-line
window._history = history;
