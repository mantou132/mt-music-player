import request from '../lib/request.js';
import { store, updateStore } from '../models/index.js';
import { toQuerystring } from '../utils/object.js';
import { transformTextToImage } from '../utils/canvas.js';
import { getPinYin } from '../utils/misc.js';
import history from '../lib/history.js';

const pictureKey = Symbol('picture');

const handler = {
  get(target, key) {
    if (key === 'picture' && !target[key]) {
      if (!target[pictureKey]) {
        const pinyin = getPinYin(target.title);
        target[pictureKey] = transformTextToImage(pinyin.substr(0, 2).toUpperCase());
      }
      return target[pictureKey];
    }
    return target[key];
  },
};

export const get = async () => {
  const list = await request('/songs');
  updateStore('songData', { list: list.map(e => new Proxy(e, handler)) });

  return list;
};

export const getFavorite = async () => {
  const list = store.songData.list.filter(data => data.star);
  updateStore('favoriteData', { list: list.map(e => new Proxy(e, handler)) });
  return list;
};

export const upload = (files) => {
  const fileArr = Array.from(files);
  updateStore('uploaderState', {
    list: store.uploaderState.list.concat(fileArr.map(file => ({ file }))),
    errorList: [],
  });

  fileArr.forEach(async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    let error;
    let data;
    try {
      data = await request('/songs', { method: 'post', body: formData });
    } catch (e) {
      error = true;
    }

    const { list, errorList } = store.uploaderState;
    const uploadedIndex = list.findIndex(({ file: f }) => file === f);
    const uploadedItem = list.splice(uploadedIndex, 1);
    if (error) {
      updateStore('uploaderState', { list, errorList: errorList.concat(uploadedItem) });
    } else {
      updateStore('uploaderState', { list });
      updateStore('songData', {
        list: [new Proxy(data, handler)].concat(store.songData.list),
      });
    }
  });
};

export const del = async (id) => {
  const { list } = store.songData;
  await request(`/songs/${id}`, { method: 'delete' });
  const deletedIndex = list.findIndex(({ id: i }) => i === id);
  list.splice(deletedIndex, 1);
  updateStore('songData', { list });
};

export const update = async (id, song) => {
  const { list } = store.songData;
  const { currentSong } = store.playerState;
  const data = await request(`/songs/${id}`, { method: 'put', body: song });
  Object.assign(list.find(({ id: i }) => i === id), data, { picture: data.picture || undefined });
  updateStore('songData', { list });
  if (currentSong === id) {
    updateStore('playerState', {});
  }
  if ('star' in song) {
    updateStore('favoriteData', { list: await getFavorite() });
  }
};

export const search = async (text) => {
  const list = await request(`/search?${toQuerystring({ q: text, type: 'song' })}`);
  updateStore('searchData', { list: list.map(e => new Proxy(e, handler)), text });
  history.replace({ path: window.location.pathname, query: `?${toQuerystring({ q: text })}` });
};
