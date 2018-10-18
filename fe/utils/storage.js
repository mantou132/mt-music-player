const cache = {
  localStorage: {},
  sessionStorage: {},
};

export default {
  get(key, type) {
    if (cache[type][key]) return cache[type][key];

    let value = window[type].getItem(key);

    if (!value) return undefined;
    try {
      value = JSON.parse(value);
    } catch (e) {
      localStorage.removeItem(key);
      value = undefined;
    }
    return value;
  },
  getLocal(key) {
    return this.get(key, 'localStorage');
  },
  getSession(key) {
    return this.get(key, 'sessionStorage');
  },
  set(key, value, type) {
    delete cache[type][key];
    return window[type].setItem(key, JSON.stringify(value));
  },
  setLocal(key, value) {
    return this.set(key, value, 'localStorage');
  },
  setSession(key, value) {
    return this.set(key, value, 'sessionStorage');
  },
};
