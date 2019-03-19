import config from '../config/index.js';

export function throttle(fn, delay = 500) {
  let timer = 0;
  return (...rest) => {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(null, ...rest), delay);
  };
}

export async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function getPinyin(汉字) {
  const { default: pinyin } = await import('../js_modules/pinyin.js');
  const py = pinyin(汉字, { style: pinyin.STYLE_INITIALS }).flat();
  if (py.length < 2) return py.join('');
  return py.map(str => str.substr(0, 1)).join('');
}

export async function getAbbrPinyin(长名称, length = 2) {
  return (await getPinyin(长名称)).substr(0, length).toUpperCase();
}

export function getSrc(src) {
  if (!src) return '';
  if (String(src).match(/^(\/\/|https?:|blob:|data:)/)) {
    return src;
  }
  return `//${config.storage}/${src}`;
}

export class Pool {
  constructor() {
    this.currentId = 0;
    this.count = 0;
    this.pool = new Map();
  }

  add(item) {
    this.pool.set(this.count, item);
    this.count += 1;
  }

  get() {
    const item = this.pool.get(this.currentId);
    if (item) {
      this.pool.delete(this.currentId);
      this.currentId += 1;
    }
    return item;
  }
}
