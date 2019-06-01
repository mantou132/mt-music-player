import request from '../lib/request.js';
import { store, updateStore } from '../models/index.js';
import { songMap, playlistMap } from '../models/data-map.js';

export const get = async () => {
  const list = await request('/playlist');
  updateStore('playlistData', {
    list: list.map(data => {
      playlistMap.set(data.id, data);
      return data.id;
    }),
  });

  return list;
};

export const getSong = async id => {
  const playlistData = await request(`/playlist/${id}/songs`);
  playlistData.list = playlistData.songs.map(data => {
    songMap.set(data.id, data);
    return data.id;
  });
  delete playlistData.songs;
  playlistMap.set(id, playlistData);
  updateStore('playlistData', {});
};

export const addSong = async (id, songId) => {
  const { list = [] } = playlistMap.get(id);
  await request(`/playlist/${id}/songs/${songId}`, { method: 'post' });
  list.unshift(songId);
  updateStore('playlistData', {});
};

export const removeSong = async (id, songId) => {
  const { list = [] } = playlistMap.get(id);
  await request(`/playlist/${id}/songs/${songId}`, { method: 'delete' });
  const songIndex = list.findIndex(sId => songId === sId);
  list.splice(songIndex, 1);
  updateStore('playlistData', {});
};

export const create = async body => {
  const { list } = store.playlistData;
  const data = await request('/playlist', { method: 'post', body });
  playlistMap.set(data.id, data);
  updateStore('playlistData', {
    list: [data.id].concat(list),
  });

  return data;
};
