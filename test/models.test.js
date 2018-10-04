import { store, connect } from '../models/index.js';


connect(store.appState.toast, (value) => {
  const title = 'modify callback';
  console.assert(value === '123', title);
  console.info(`%c✔︎ Assertion success: ${title}`, 'color: green');
});
store.appState.toast.text = '123';
