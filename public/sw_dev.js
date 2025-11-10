/* eslint-disable no-console */

globalThis.addEventListener('install', (_event) => {
  console.log('Service Worker installiert')
  globalThis.skipWaiting()
})

globalThis.addEventListener('activate', (_event) => {
  console.log('Service Worker aktiviert')
  return globalThis.clients.claim()
})

globalThis.addEventListener('fetch', (event) => {
  // Einfacher Durchleitungsmodus: alles normal übers Netz laden
  event.respondWith(fetch(event.request))
})
