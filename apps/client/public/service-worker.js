/*
 * This file will not automatically update when you change it in development.
 * Restart the development server to see changes.
 */

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

// listen for 401s to tell the client to redirect to login
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      if (response.status === 401) {
        self.clients.matchAll().then((clients) => {
          clients.forEach((client) => {
            client.postMessage({
              type: '401_UNAUTHORIZED'
            });
          });
        });
      }

      return response;
    })
  )
});
