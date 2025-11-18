/* eslint-disable no-console */

const CACHE_NAME = 'grow-diary-v1'

const ASSETS_TO_CACHE = []

globalThis.addEventListener('install', (event) => {
  console.log('Service Worker installiert')
  globalThis.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    }),
  )
})

globalThis.addEventListener('activate', (event) => {
  console.log('Service Worker aktiviert')
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key)),
      ),
    ),
  )
  return globalThis.clients.claim()
})

globalThis.addEventListener('fetch', (event) => {
  // Einfacher Durchleitungsmodus: alles normal übers Netz laden
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) {
        console.info('Cache found')
        return cached
      }
      console.info('Cache not found !')
      return fetch(event.request)
    }),
  )
})
