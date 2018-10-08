export const playerState = {
  state: 'paused', // playing, paused, loading, error
  currentSong: null,
  volume: 0.1,
  muted: false,
  shuffle: false,
  mode: 'repeat',
};
export const audioState = {
  currentTime: 0,
  duration: 180,
};
export const toastState = {
  type: 'info',
  text: null,
};
export const menuState = {
  type: '',
  position: {},
  list: [],
};
export const selectorState = {
  type: '',
  list: [],
};
export const uploaderState = {};
export const drawerState = {
  isOpen: false,
};
