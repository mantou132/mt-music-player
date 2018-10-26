import { store, updateStore, connect } from '../models/index.js';
import { transformTextToImage } from '../utils/canvas.js';
import { getPinYin } from '../utils/misc.js';

const photoKey = Symbol('photo');
const handler = {
  get(target, key) {
    if (key === 'photo' && !target[key]) {
      if (!target[photoKey]) {
        const pinyin = getPinYin(target.name || 'unknown');
        target[photoKey] = transformTextToImage(pinyin.substr(0, 2).toUpperCase());
      }
      return target[photoKey];
    }
    return target[key];
  },
};

// eslint-disable-next-line
export const get = async () => {
  const { list: songList } = store.songData;
  const map = new Map();
  songList.forEach((song) => {
    if (map.has(song.artist)) return;
    map.set(
      song.artist,
      new Proxy(
        {
          name: song.artist,
          photo: '',
        },
        handler,
      ),
    );
  });
  const list = [...map.values()];
  updateStore('artistData', { list });
  return list;
};

connect(
  'songData',
  get,
);
