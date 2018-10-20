import { importModule } from 'https://uupaa.github.io/dynamic-import-polyfill/importModule.js';
import config from '../config/index.js';

export function throttle(fn, delay = 500) {
  let timer = 0;
  return (...rest) => {
    clearTimeout(timer);
    timer = setTimeout(fn.bind(null, ...rest), delay);
  };
}

let pinyin = (汉字) => {
  importModule('https://dev.jspm.io/pinyin').then(({ default: py }) => {
    pinyin = py;
  });
  return [汉字];
};
export function getPinYin(汉字) {
  const py = pinyin(汉字, { style: pinyin.STYLE_INITIALS }).flat();
  if (py.length < 2) return py.join('');
  return py.map(str => str.substr(0, 1)).join('');
}

export function getSrc(src) {
  if (!src) return '';
  if (String(src).match(/^(\/\/|https?:|blob:|data:)/)) {
    return src;
  }
  return `//${config.storage}/${src}`;
}
