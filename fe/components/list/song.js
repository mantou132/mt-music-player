import { html } from '../../js_modules/lit-html.js';
import { repeat } from '../../js_modules/npm:lit-html@1.0.0/directives/repeat.js';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import { playlistMap, songMap } from '../../models/data-map.js';

export default class AppSongList extends Component {
  static get observedAttributes() {
    return ['id', 'filtername', 'filtervalue'];
  }

  constructor() {
    super();
    this.renderItem = this.renderItem.bind(this);
  }

  connectStart() {
    const songStore = store.songData;
    this.state = {
      playerState: store.playerState,
      data: this.data,
      songData: this.data === songStore ? '' : songStore,
    };
  }

  render() {
    const id = this.getAttribute('id');
    const filtername = this.getAttribute('filtername');
    const filtervalue = this.getAttribute('filtervalue');
    let list;
    if (id !== null) {
      // playlist
      ({ list = [] } = playlistMap.get(id));
    } else {
      ({ list = [] } = this.state.data);
    }
    if (filtername) {
      list = list.filter(
        songId => songMap.get(songId)[filtername] === filtervalue,
      );
    }
    console.count('[TODO pref] song lint render count');
    setTimeout(() => console.countReset('[TODO pref] song lint render count'));
    return html`
      <style>
        :host {
          flex-grow: 1;
        }
      </style>
      ${repeat(list, songId => songId, this.renderItem)}
    `;
  }

  renderItem(songId) {
    const { errorList, currentSong, state } = this.state.playerState;
    const playIcon = state === 'paused' ? 'pause' : 'playing';
    const isError = errorList.includes(songId);
    const { updatedAt } = songMap.get(songId);
    return html`
      <song-list-item
        id="${songId}"
        updatedat="${updatedAt}"
        ?error="${isError}"
        ?active="${currentSong === songId}"
      >
        <app-icon
          name="${playIcon}"
          ?hidden="${currentSong !== songId || isError}"
        >
        </app-icon>
      </song-list-item>
    `;
  }

  connected() {
    if (this.fetchData) this.fetchData();
  }

  attributeChanged() {
    if (this.fetchData) this.fetchData();
  }
}

customElements.define('app-song-list', AppSongList);
