import './lib/history.js';
import './icons/index.js';

import './components/splash/index.js';
import './components/upload/index.js';
import './components/toast/index.js';
import './components/menu/index.js';
import './components/player/index.js';
import './components/router/index.js';

if ('paintWorklet' in CSS) {
  CSS.paintWorklet.addModule('paintworklet.js');
}

navigator.serviceWorker.register('serviceworker.js');

// test
// import './test/models.tests.js';
