import { store, updateStore } from '../models/index.js';
import storage from '../utils/storage.js';
import { capitalize } from '../utils/string.js';

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

    window.history.pushState(state, title, path + query);

    const newList = list.slice(0, currentIndex + 1).concat(historyItem);
    document.title = capitalize(title);
    updateStore('historyState', {
      list: newList,
      currentIndex: newList.length - 1,
    });
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
    document.title = capitalize(title);
    updateStore('historyState', {
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

updateStore('historyState', storage.getSession('historyState'));
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
  updateStore('historyState', {
    currentIndex: newStateIndex,
  });

  if (list[newStateIndex]) {
    document.title = capitalize(list[newStateIndex].title);
  }
});

export default history;

// eslint-disable-next-line
window._history = history;
