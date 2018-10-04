/**
 * goal:
 *  Data is bound to components in one direction
 *  Notify component when data is updated
 */

import appState from './appstate.js';

const handles = new WeakMap();

const createStore = (originStore) => {
  const handler = {
    get(target, key) {
      return target[key];
    },
    set(target, key, value, receiver) {
      const listeners = handles.get(receiver);
      if (listeners && value !== target[key]) {
        listeners.forEach(func => func(value));
      }
      // value is Map, Set, Function ...
      if (typeof value === 'object' && value !== null) {
        target[key] = createProxy(value);
      } else {
        target[key] = value;
      }
      return true;
    },
    deleteProperty(target, key) {
      delete target[key];
    },
  };
  const createProxy = (obj) => {
    const proxy = new Proxy(obj, handler);
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      proxy[key] = obj[key];
    });

    return proxy;
  };

  return createProxy(originStore);
};

export const store = createStore({
  appState,
});

export const connect = (data, func) => {
  if (!handles.has(data)) {
    handles.set(data, new Set());
  }
  const listeners = handles.get(data);
  listeners.add(func);
};
