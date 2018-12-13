import { store, updateStore, connect } from '../models/index.js';
import { transformTextToSVG } from '../utils/canvas.js';
import { getPinYin } from '../utils/misc.js';

const map = new Map();
// eslint-disable-next-line
export const get = async () => {
  const { list: songList } = store.songData;
  songList.forEach((song) => {
    if (map.has(song.artist)) return;
    map.set(song.artist, {
      name: song.artist,
      photo: transformTextToSVG(
        getPinYin(song.artist || 'unknown')
          .substr(0, 2)
          .toUpperCase(),
      ),
    });
  });
  const list = [...map.values()];
  updateStore('artistData', { list });
  return list;
};

connect(
  'songData',
  get,
);
