export const authState = {
  key: '',
};
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
  // {text, handle}
  list: [],
  closeCallback: null,
};
export const selectorState = {
  type: '',
  list: [],
};
export const modalState = {
  // modal state
  // {title, key}
  list: [],
};
export const historyState = {
  // {path, query, state}
  list: [],
  currentIndex: 0,
};
export const uploaderState = {
  // {file}
  list: [],
};
export const drawerState = {
  isOpen: false,
};
