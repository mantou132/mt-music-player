// use in component, history

import * as appState from './appstate.js';
import * as windowState from './window.js';
import * as data from './data.js';

export const PAGE_KEY = Symbol('page');

const handles = new Map();

const createStore = originStore => {
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
  keys.forEach(key => {
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
  ...windowState,
  ...data,
});

// eslint-disable-next-line
window._store = store;

const updaterSet = new Set();
export const updateStore = (page, value) => {
  if (!updaterSet.size) {
    // delayed execution callback after updating store
    queueMicrotask(() => {
      updaterSet.forEach(func => func(value));
      updaterSet.clear();
    });
  }
  Object.assign(store[page], value);
  const listeners = handles.get(page);
  listeners.forEach(func => {
    if (func.connectedPage.has(page)) {
      updaterSet.add(func);
    }
  });
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
