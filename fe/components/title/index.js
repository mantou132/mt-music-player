import Component from '../../lib/component.js';
import { store } from '../../models/index.js';
import { capitalize } from '../../utils/string.js';
import routeMap from '../router/map.js';

/**
 * Synchronize documet.title
 * also show in AppBar
 */
customElements.define(
  'app-title',
  class extends Component {
    constructor() {
      super();
      this.routeMap = Object.values(routeMap);
      this.state = store.historyState;
    }

    render() {
      const { list, currentIndex } = store.historyState;
      const { path: currentPath, title } = list[currentIndex];
      const route = this.routeMap.find(({ path }) => path === currentPath);

      document.title = capitalize(
        title || (route && route.title) || routeMap.HOME.title,
      );
      if (this.hidden) return '';
      return document.title;
    }
  },
);
