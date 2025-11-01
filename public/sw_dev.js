/* eslint-disable no-console */

const CACHE_NAME = 'grow-diary-v1'

const ASSETS_TO_CACHE = [
  './', // index.html
  './vite.svg',
  './manifest.json',
  './assets/index-DjvmPv1N.css',
  './assets/index-BXHna_Gg.js',
  './icons/apple-touch-icon.png',
  './icons/favicon.ico',
  './icons/favicon-16x16.png',
  './icons/favicon-32x32.png',
  './icons/icon-192.png',
  './icons/icon-512.png',
]

globalThis.addEventListener('install', (event) => {
  console.log('Service Worker installiert')
  globalThis.skipWaiting()
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE)
    }),
  )
})

globalThis.addEventListener('activate', (_event) => {
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
