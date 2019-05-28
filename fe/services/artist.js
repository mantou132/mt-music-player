import { updateStore, connect } from '../models/index.js';
import { songMap } from '../models/data-map.js';

const map = new Map();

export const get = async () => {
  songMap.forEach(song => {
    if (map.has(song.artist)) return;
    map.set(song.artist, {
      name: song.artist,
      photo: '',
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
