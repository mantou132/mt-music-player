import { dew as _dataDictZiWebDew } from '../data/dict-zi-web.dew.js';
import { dew as _pinyinDew } from './pinyin.dew.js';
var exports = {},
    _dewExec = false;
export function dew() {
  if (_dewExec) return exports;
  _dewExec = true;

  // 解压拼音库。
  // @param {Object} dict_combo, 压缩的拼音库。
  // @param {Object} 解压的拼音库。
  function buildPinyinCache(dict_combo) {
    let hans;
    let uncomboed = {};

    for (let py in dict_combo) {
      hans = dict_combo[py];

      for (let i = 0, han, l = hans.length; i < l; i++) {
        han = hans.charCodeAt(i);

        if (!uncomboed.hasOwnProperty(han)) {
          uncomboed[han] = py;
        } else {
          uncomboed[han] += "," + py;
        }
      }
    }

    return uncomboed;
  }

  const PINYIN_DICT = buildPinyinCache(_dataDictZiWebDew());

  const Pinyin = _pinyinDew();

  const pinyin = new Pinyin(PINYIN_DICT);
  exports = pinyin.convert.bind(pinyin);
  exports.compare = pinyin.compare.bind(pinyin);
  exports.STYLE_NORMAL = Pinyin.STYLE_NORMAL;
  exports.STYLE_TONE = Pinyin.STYLE_TONE;
  exports.STYLE_TONE2 = Pinyin.STYLE_TONE2;
  exports.STYLE_TO3NE = Pinyin.STYLE_TO3NE;
  exports.STYLE_INITIALS = Pinyin.STYLE_INITIALS;
  exports.STYLE_FIRST_LETTER = Pinyin.STYLE_FIRST_LETTER;
  return exports;
}