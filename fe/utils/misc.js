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

let pinyin = (汉字) => {
  import('../js_modules/pinyin.js').then(({ default: py }) => {
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
