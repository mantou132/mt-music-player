// Non-persistent storage
// InitData may be needed for updates
// May modify the history stack

export const modalState = {
  isOpen: false,
  title: '',
  complete: 'ok',
  cancel: 'cancel',
  template: '',
  onclose: null,
  oncomplete: null,
  oncancel: null,
};
export const confirmState = {
  isOpen: false,
  title: '',
  complete: 'confirm',
  cancel: 'cancel',
  text: '',
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
