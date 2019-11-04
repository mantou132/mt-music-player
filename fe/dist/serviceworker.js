/* eslint no-restricted-globals: 1 */

const assetsToCache = [...new Set([self.location.pathname, '/'])].map(
  path => self.location.origin + path,
);

self.addEventListener('install', () => {
  self.skipWaiting();
  self.caches.open('mt-music').then(cache => {
    cache.addAll(assetsToCache);
  });
});

self.addEventListener('fetch', event => {
  const { request } = event;
  const requestUrl = new URL(request.url);

  const isSomeOrigin = requestUrl.origin === self.location.origin;
  const isApiFetch =
    (isSomeOrigin && requestUrl.pathname.startsWith('/api')) ||
    requestUrl.origin.includes('api.');
  const fetchSuccess = response => {
    if (response.ok) {
      const responseCache = response.clone();
      self.caches
        .open('mt-music')
        .then(cache => cache.put(request, responseCache));
      return response;
    }
    throw new Error({ response });
  };
  const fetchError = ({ response }) =>
    response ||
    new Response(
      `
    <html>
      <meta charset="utf-8">
      <meta http-equiv="refresh" content="3;url=${request.referrer}">
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1">
      <title>Net Error</title>
      <body>
        <h1>Net Error</h1>
        <p>Jumping to the previous page...</p>
        <h1>网络错误</h1>
        <p>正在跳转到前一页...</p>
      </body>
    </html>
  `,
      {
        status: 500,
        statusText: 'Server Error',
        headers: {
          'Content-Type': 'text/html',
        },
      },
    );

  if (request.method !== 'GET') return;
  if (!isSomeOrigin && !isApiFetch) return; // CDN web 资源, 图片, 视频的缓存交给第三方管理

  event.respondWith(
    fetch(
      request,
      isSomeOrigin ? {} : { mode: 'cors', credentials: 'same-origin' },
    )
      .then(fetchSuccess)
      .catch(error =>
        self.caches
          .match(request, {
            ignoreSearch: request.mode === 'navigate',
          })
          .then(cache => {
            if (cache !== undefined) {
              return cache;
            }
            return fetchError(error);
          }),
      ),
  );
});
