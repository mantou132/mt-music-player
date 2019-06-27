import { store, updateStore, connect } from '../models/index.js';
import { songMap } from '../models/data-map.js';

// eslint-disable-next-line
export const get = async () => {
  const map = new Map();
  songMap.forEach(song => {
    if (map.has(song.album)) return;
    map.set(song.album, {
      title: song.album,
      cover: song.picture,
    });
  });
  const list = [...map.values()];
  updateStore(store.albumData, { list });
  return list;
};

connect(
  store.songData,
  get,
);
