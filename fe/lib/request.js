import { store } from '../models/index.js';
import config from '../config/index.js';

export default async function request(path, options = {}) {
  if (store.userData.key) {
    options.headers = {
      ...options.headers,
      'x-user': store.userData.key,
    };
  }
  if (
    options.body &&
    !(options.body instanceof FormData) &&
    typeof options.body === 'object'
  ) {
    options.body = JSON.stringify(options.body);
    options.headers = {
      ...options.headers,
      'content-type': 'application/json',
    };
  }
  const res = await fetch(`//${config.api}${path}`, options);
  const data = await res.json();
  return data;
}
