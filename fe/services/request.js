import { store } from '../models/index.js';
import config from '../config/index.js';

export default async function request(path, options = {}) {
  if (store.authState.key) {
    options.headers = {
      ...options.headers,
      'x-user': store.authState.key,
    };
  }
  const res = await fetch(`//${config.api}${path}`, options);
  const data = await res.json();
  return data;
}
