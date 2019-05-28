class DataMap extends Map {
  get(id) {
    return super.get(id) || {};
  }

  setList(list = []) {
    list.forEach(data => {
      this.set(data.id, data);
    });
  }
}

export const songMap = new DataMap();
// Map <id: { ...info, list: songId[] }>
export const playlistMap = new DataMap();

// Currently these data are front-end generated
// export const artistMap = new DataMap();
// export const albumMap = new DataMap();
