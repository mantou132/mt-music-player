import request from '../lib/request.js';
import { store, updateStore } from '../models/index.js';
import { transformTextToImage } from '../utils/canvas.js';
import { getPinYin } from '../utils/misc.js';

const imageKey = Symbol('image');

const handler = {
  get(target, key) {
    if (key === 'image' && !target[key]) {
      if (!target[imageKey]) {
        const pinyin = getPinYin(target.title);
        target[imageKey] = transformTextToImage(pinyin.substr(0, 2).toUpperCase(), {
          width: 128,
          height: 128,
        });
      }
      return target[imageKey];
    }
    return target[key];
  },
};

export const get = async () => {
  const list = await request('/playlist');
  updateStore('playlistData', { list: list.map(e => new Proxy(e, handler)) });

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
  store.playlistData[id].splice(store.playlistData[id].find(song => songId === song.id), 1);
  updateStore('playlistData', {
    [id]: store.playlistData[id],
  });
};

export const create = async (body) => {
  const { list } = store.playlistData;
  const data = await request('/playlist', { method: 'post', body });
  updateStore('playlistData', { list: [new Proxy(data, handler)].concat(list) });

  return data;
};
