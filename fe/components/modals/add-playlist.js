import { html, render } from '../../js_modules/lit-html.js';
import { create } from '../../services/playlist.js';

export default function getAddPlaylistModal() {
  const form = document.createElement('app-form');
  render(
    html`
      <form-text label="title" name="title"></form-text>
    `,
    form,
  );
  const oncomplete = () => {
    create(form.value);
  };
  return {
    title: 'add playlist',
    complete: 'save',
    cancel: 'cancel',
    template: form,
    oncomplete,
  };
}
