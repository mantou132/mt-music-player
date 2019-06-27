export const STORE = Symbol('key: get store');
export const STORE_MODULE = Symbol('key: get store module');
export const STORE_MODULE_KEY = Symbol('key: get store module key');

const FUNC_MARK_KEY = Symbol('function mark');
const HANDLES_KEY = Symbol('handles key');

export const createStore = originStore => {
  const handler = {
    has(target, key) {
      return key in target;
    },
    get(target, key) {
      return target[key];
    },
    set(target, key, value) {
      target[key] = value;
      const listeners = target[key][HANDLES_KEY].get(key);
      listeners.forEach(func => func[FUNC_MARK_KEY].has(key) && func(value));
      return true;
    },
  };

  const proxy = new Proxy(originStore, handler);
  const keys = Object.keys(originStore);
  keys.forEach(key => {
    const storeModule = originStore[key];
    storeModule[STORE] = proxy;
    storeModule[STORE_MODULE] = storeModule;
    storeModule[STORE_MODULE_KEY] = key;
    storeModule[HANDLES_KEY] = new Map([[key, new Set()]]);
    proxy[key] = storeModule;
  });

  return proxy;
};

const updaterSet = new Set();
export const updateStore = (storeModule, value) => {
  if (!updaterSet.size) {
    // delayed execution callback after updating store
    queueMicrotask(() => {
      updaterSet.forEach(func => func(value));
      updaterSet.clear();
    });
  }
  const storeKey = storeModule[STORE_MODULE_KEY];
  Object.assign(storeModule[STORE_MODULE], value); // Equivalent set store[key]
  const listeners = storeModule[HANDLES_KEY].get(storeKey);
  listeners.forEach(func => {
    if (func[FUNC_MARK_KEY].has(storeKey)) {
      updaterSet.add(func);
    }
  });
};

export const connect = (storeModule, func) => {
  const storeKey = storeModule[STORE_MODULE_KEY];
  const listeners = storeModule[HANDLES_KEY].get(storeKey);
  if (!func[FUNC_MARK_KEY]) func[FUNC_MARK_KEY] = new Set();
  func[FUNC_MARK_KEY].add(storeKey);
  listeners.add(func);
};

export const disConnect = (storeModule, func) => {
  const storeKey = storeModule[STORE_MODULE_KEY];
  const listeners = storeModule[HANDLES_KEY].get(storeKey);
  listeners.delete(func);
};
