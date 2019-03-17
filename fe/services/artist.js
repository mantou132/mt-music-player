import { store, updateStore, connect } from '../models/index.js';

const map = new Map();

export const get = async () => {
  const { list: songList } = store.songData;
  songList.forEach(song => {
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
