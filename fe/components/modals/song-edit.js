import { html, render } from 'https://dev.jspm.io/lit-html';
import mediaQuery from '../../lib/mediaquery.js';
import { getSrc } from '../../utils/misc.js';
import { update } from '../../services/song.js';

export default function getSongEditModal(song) {
  const form = document.createElement('app-form');
  render(
    html`
      <style>
        app-form {
          display: flex;
        }
        form-img {
          width: 10rem;
          height: 10rem;
          margin: 0 var(--modal-margin) var(--modal-margin) 0;
        }
        form-text {
          margin-bottom: 2em;
        }
        .text {
          flex-grow: 1;
        }
        @media ${mediaQuery.PHONE} {
          app-form {
            flex-direction: column;
          }
        }
      </style>
      <form-img
        name="picture"
        .limit="${{ size: { width: 512, height: 512 }, filesize: 200 * 1024 }}"
        src="${getSrc(song.picture)}">
      </form-img>
      <div class="text">
        <form-text label="title" name="title" value="${song.title || ''}"></form-text>
        <form-text label="artist" name="artist" value="${song.artist || ''}"></form-text>
        <form-text label="album" name="album" value="${song.album || ''}"></form-text>
      </div>
    `,
    form,
  );
  const oncomplete = () => {
    update(Number(song.id), form.value);
  };
  return {
    title: 'edit music info',
    complete: 'save',
    cancel: 'cancel',
    template: form,
    oncomplete,
  };
}
