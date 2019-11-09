// TODO: external library
// support electron/flutter mtApp

const MT_APP_BRIDGE_NAME = Object.getOwnPropertyNames(window).find(e =>
  e.startsWith('__MT__APP__BRIDGE'),
);

if (MT_APP_BRIDGE_NAME && window === window.top) {
  const bridgePostMessage = message => {
    const submitMessage = { id: Date.now(), ...message };
    window[MT_APP_BRIDGE_NAME].postMessage(JSON.stringify(submitMessage));
    console.log('<=====', submitMessage);
    return submitMessage;
  };

  // init mtApp
  window.mtApp = {
    call(api, params = {}, options = {}) {
      const { timeout = 3000 } = options;
      const { id } = bridgePostMessage({
        type: 'call',
        data: { api, params },
      });
      let resolve;
      let reject;
      setTimeout(() => reject(new Error('call timeout')), timeout);
      window.addEventListener(
        `mtappmessage${id}`,
        ({ detail }) => {
          resolve(detail);
        },
        { once: true },
      );
      return new Promise(
        res => {
          resolve = res;
        },
        rej => {
          reject = rej;
        },
      );
    },
  };

  // unified open method
  window.open = params => {
    bridgePostMessage({ type: 'open', data: params });
    return {
      postMessage() {
        console.log('unimplement!');
      },
    };
  };

  // unified close method
  window.close = () => {
    bridgePostMessage({ type: 'close', data: window.location.href });
  };

  Object.defineProperty(window.navigator, 'standalone', {
    value: true,
  });

  const data = MT_APP_BRIDGE_NAME.split('____')[1];
  if (data) {
    const { notch } = JSON.parse(window.atob(data));

    // init notch area
    if (notch) {
      const styleEle = document.createElement('style');
      styleEle.innerText = `
        :root {
          --mt-app-safe-area-inset-top: ${notch.top}px;
          --mt-app-safe-area-inset-left: ${notch.left}px;
          --mt-app-safe-area-inset-right: ${notch.right}px;
          --mt-app-safe-area-inset-bottom: ${notch.bottom}px;
        }
      `;
      document.head.append(styleEle);
    }
  }
}
