import './theme.js';

import './icons/index.js';

import './components/action/index.js';
import './components/confirm/index.js';
import './components/drawer/index.js';
import './components/form/index.js';
import './components/link/index.js';
import './components/list/index.js';
import './components/menu/index.js';
import './components/modal/index.js';
import './components/notfound/index.js';
import './components/player/index.js';
import './components/range/index.js';
import './components/ripple/index.js';
import './components/router/index.js';
import './components/splash/index.js';
import './components/title/index.js';
import './components/toast/index.js';
import './components/upload/index.js';

window.addEventListener('load', () => {
  if ('paintWorklet' in CSS) {
    // Not ES module
    // So load from the root directory
    CSS.paintWorklet.addModule('paintworklet.js');
  }

  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('serviceworker.js');
  }
});

window.onerror = null;

// test
// import './test/models.tests.js';
