import * as appState from './appstate.js';
import songData from './song.js';
import albumData from './album.js';
import artistData from './artist.js';

export const PAGE_KEY = Symbol('page');

const handles = new Map();

const createStore = (originStore) => {
  const handler = {
    has(target, key) {
      return key in target;
    },
    get(target, key) {
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      const listeners = handles.get(key);
      listeners.forEach(func => func.connectedPage.has(key) && func(value));
      return true;
    },
  };

  const proxy = new Proxy(originStore, handler);
  const keys = Object.keys(originStore);
  keys.forEach((key) => {
    handles.set(key, new Set());
    proxy[key] = originStore[key];
    proxy[key][PAGE_KEY] = key;
  });
  return proxy;
};

/**
 * @return {} property is `Store` nesting
 */
export const store = createStore({
  ...appState,
  songData,
  artistData,
  albumData,
});

// eslint-disable-next-line
window._store = store;

export const updateStore = (page, value) => {
  Object.assign(store[page], value);
  const listeners = handles.get(page);
  listeners.forEach(func => func.connectedPage.has(page) && func(value));
};

export const connect = (page, func) => {
  const listeners = handles.get(page);
  if (!func.connectedPage) func.connectedPage = new Set();
  func.connectedPage.add(page);
  listeners.add(func);
};

export const disConnect = (page, func) => {
  const listeners = handles.get(page);
  listeners.delete(func);
};
