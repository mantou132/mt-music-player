import { store, updateStore } from '../models/index.js';

const colseHandleMap = new Map();
const privateKey = Symbol('private');

window.addEventListener('popstate', (event) => {
  // forward or back
  // none replace

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
    const closeHandle = colseHandleMap.get(currentState.state.$key);
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

const generateState = (data, close) => {
  if (data.$key) throw new Error('`$key` is not allowed');
  if (data.$close) throw new Error('`$close` is not allowed');
  const $key = performance.now();
  colseHandleMap.set($key, close);
  return {
    ...data,
    $key,
    $close: !!close,
  };
};

const history = {
  forward() {
    window.history.forward();
  },

  back() {
    window.history.back();
  },

  push(options) {
    const {
      data = {}, title, path, query = '', close,
    } = options;
    const { list } = store.historyState;

    // same router
    if (options === list[list.length - 1]) {
      updateStore('historyState', {});
    }

    const state = generateState(data, close);
    window.history.pushState(state, title, path + query);

    if (title) document.title = title;
    const newList = list.concat({
      path,
      query,
      state,
      title: title || document.title,
    });
    updateStore('historyState', {
      list: newList,
      currentIndex: newList.length - 1,
    });
  },

  replace({
    data = {}, title, path, query = '', close,
  }) {
    const state = generateState(data, close);
    window.history.replaceState(state, title, path + query);

    if (title) document.title = title;
    const { list } = store.historyState;
    list.length -= 1;
    const newList = list.concat({
      path,
      query,
      state,
      title: title || document.title,
    });
    updateStore('historyState', {
      list: newList,
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

export default history;

// eslint-disable-next-line
window._history = history;
