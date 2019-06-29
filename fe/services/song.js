import request from '../lib/request.js';
import { store, updateStore } from '../models/index.js';
import history, { QueryString } from '../lib/history.js';
import { songMap } from '../models/data-map.js';

export const get = async () => {
  const list = await request('/songs');
  updateStore(store.songData, {
    list: list.map(data => {
      songMap.set(data.id, data);
      return data.id;
    }),
  });

  return list;
};

export const getFavorite = async () => {
  await get();
  const list = [];
  songMap.forEach(({ star, id }) => {
    if (star) list.push(id);
  });
  updateStore(store.favoriteData, { list });
  return list;
};

export const upload = files => {
  const fileArr = Array.from(files);
  updateStore(store.uploaderState, {
    list: store.uploaderState.list.concat(fileArr.map(file => ({ file }))),
    errorList: [],
  });

  fileArr.forEach(async file => {
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
      updateStore(store.uploaderState, {
        list,
        errorList: errorList.concat(uploadedItem),
      });
    } else {
      updateStore(store.uploaderState, { list });
      songMap.set(data.id, data);
      updateStore(store.songData, {
        list: [data.id].concat(store.songData.list),
      });
    }
  });
};

export const del = async id => {
  const { list } = store.songData;
  await request(`/songs/${id}`, { method: 'delete' });
  const deletedIndex = list.findIndex(songId => songId === id);
  list.splice(deletedIndex, 1);
  updateStore(store.songData, { list });
};

export const update = async (id, song) => {
  const { currentSong } = store.playerState;
  const data = await request(`/songs/${id}`, { method: 'put', body: song });
  Object.assign(songMap.get(id), data, {
    picture: data.picture || undefined,
  });
  updateStore(store.songData, {});
  if (currentSong === id) {
    updateStore(store.playerState, {});
  }
  if ('star' in song) {
    updateStore(store.favoriteData, { list: await getFavorite() });
  }
};

export const search = async text => {
  const list = await request(
    `/search${new QueryString({ q: text, type: 'song' })}`,
  );
  updateStore(store.searchData, {
    list: list.map(data => {
      songMap.set(data.id, data);
      return data.id;
    }),
    text,
  });
  history.replace({
    path: history.location.path,
    query: new QueryString({ q: text }),
  });
};
