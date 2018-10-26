import { store, updateStore, connect } from '../models/index.js';

// eslint-disable-next-line
export const get = async () => {
  const { list: songList } = store.songData;
  const map = new Map();
  songList.forEach((song) => {
    if (map.has(song.album)) return;
    map.set(song.album, {
      title: song.album,
      cover: song.picture,
    });
  });
  const list = [...map.values()];
  updateStore('albumData', { list });
  return list;
};

connect(
  'songData',
  get,
);
