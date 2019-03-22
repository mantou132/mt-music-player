import { html } from '../../js_modules/lit-html.js';
import { repeat } from '../../js_modules/npm:lit-html@1.0.0/directives/repeat.js';
import Component from '../../lib/component.js';
import { store } from '../../models/index.js';

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
    let { [id === null ? 'list' : id]: list = [] } = this.state.data;
    if (filtername) {
      list = list.filter(e => e[filtername] === filtervalue);
    }
    return html`
      <style>
        :host {
          flex-grow: 1;
        }
      </style>
      ${repeat(list, data => data.id, this.renderItem)}
    `;
  }

  renderItem(data) {
    const { errorList, currentSong, state } = this.state.playerState;
    const playIcon = state === 'paused' ? 'pause' : 'playing';
    const isError = errorList.includes(data.id);
    return html`
      <song-list-item
        id="${data.id}"
        updatedat="${data.updatedAt}"
        ?error="${isError}"
        ?active="${currentSong === data.id}"
      >
        <app-icon
          name="${playIcon}"
          ?hidden="${currentSong !== data.id || isError}"
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
