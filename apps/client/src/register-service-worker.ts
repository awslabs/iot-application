export function registerServiceWorker() {
  const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;

  navigator.serviceWorker.register(swUrl).catch((error) => {
    console.error('Error during service worker registration:', error);
  });
}
