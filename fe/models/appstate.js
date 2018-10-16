export const authState = {
  key: '',
};
export const playerState = {
  currentSong: null,
  state: 'paused', // playing, paused, loading, error
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
  title: '',
  complete: 'ok',
  cancel: 'cancel',
  template: null,
  onclose: null,
  oncomplete: null,
  oncancel: null,
};
export const historyState = {
  // {path, query, title, state}
  // state: {timestamp, close}
  list: [],
  currentIndex: -1,
};
export const uploaderState = {
  // {file}
  list: [],
};
export const drawerState = {
  isOpen: false,
};
