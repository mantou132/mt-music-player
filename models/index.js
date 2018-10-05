/**
 * goal:
 *  Data is bound to components in one direction
 *  Notify component when data is updated
 */

import appState from './appstate.js';

export const parentKey = Symbol('parent');
export const nameKey = Symbol('name');

const handles = new WeakMap();

const createStore = (originStore) => {
  const handler = {
    get(target, key) {
      return target[key];
    },
    set(target, key, value, receiver) {
      const oldValue = target[key];
      // value is Map, Set, Function ...
      if (key === parentKey) {
        target[key] = value;
      } else if (typeof value === 'object' && value !== null) {
        target[key] = createProxy(value, receiver, key);
      } else {
        target[key] = value;
      }
      const listeners = handles.get(receiver);
      if (listeners && value !== oldValue) {
        listeners.forEach(func => func(value));
      }
      return true;
    },
    deleteProperty(target, key) {
      delete target[key];
    },
  };
  const createProxy = (obj, parentProxy, name) => {
    const proxy = new Proxy(obj, handler);
    const keys = Object.keys(obj);
    keys.forEach((key) => {
      proxy[key] = obj[key];
      proxy[parentKey] = parentProxy;
      proxy[nameKey] = name;
    });

    return proxy;
  };

  return createProxy(originStore);
};

/**
 * @return {} property is `Store` nesting
 */
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

export const disConnect = (data, func) => {
  const listeners = handles.get(data);
  if (listeners) listeners.delete(func);
};
