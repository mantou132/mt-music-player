// Non-persistent storage
// InitData may be needed for updates
// May modify the history stack

export const modalState = {
  title: '',
  complete: 'ok',
  cancel: 'cancel',
  template: null,
  onclose: null,
  oncomplete: null,
  oncancel: null,
};
export const confirmState = {
  title: '',
  complete: 'confirm',
  cancel: 'cancel',
  text: null,
  oncomplete: null,
  oncancel: null,
};
export const menuState = {
  isOpen: false,
  type: '',
  target: null,
  stage: document.body,
  // {text, handle}
  list: [],
  onclose: null,
};
export const drawerState = {
  isOpen: false,
};
