import { createStore } from '../lib/store.js';
import * as appState from './appstate.js';
import * as windowState from './window.js';
import * as data from './data.js';

export * from '../lib/store.js';

export const store = createStore({
  ...appState,
  ...windowState,
  ...data,
});

// eslint-disable-next-line
window._store = store;
