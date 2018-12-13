import request from '../lib/request.js';
import { store, updateStore } from '../models/index.js';
import { transformTextToSVG } from '../utils/canvas.js';
import { getPinYin } from '../utils/misc.js';

export const get = async () => {
  const list = await request('/playlist');
  updateStore('playlistData', {
    list: list.map(e => ({
      ...e,
      image:
        e.image
        || transformTextToSVG(
          getPinYin(e.title)
            .substr(0, 2)
            .toUpperCase(),
        ),
    })),
  });

  return list;
};

export const getSong = async (id) => {
  const list = await request(`/playlist/${id}/songs`);
  updateStore('playlistData', {
    [id]: list.map(e => store.songData.list.find(song => song.id === e.songId)),
  });
};

export const addSong = async (id, songId) => {
  await request(`/playlist/${id}/songs/${songId}`, { method: 'post' });
  updateStore('playlistData', {
    [id]: [store.songData.list.find(song => song.id === songId)].concat(store.playlistData[id]),
  });
};

export const removeSong = async (id, songId) => {
  await request(`/playlist/${id}/songs/${songId}`, { method: 'delete' });
  store.playlistData[id].splice(store.playlistData[id].findIndex(song => songId === song.id), 1);
  updateStore('playlistData', {
    [id]: store.playlistData[id],
  });
};

export const create = async (body) => {
  const { list } = store.playlistData;
  const data = await request('/playlist', { method: 'post', body });
  updateStore('playlistData', {
    list: [
      {
        ...data,
        image:
          data.image
          || transformTextToSVG(
            getPinYin(data.title)
              .substr(0, 2)
              .toUpperCase(),
          ),
      },
    ].concat(list),
  });

  return data;
};
