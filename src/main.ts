/* eslint-disable no-console */

import type { ToastContainerOptions } from 'vue3-toastify'
import { createApp } from 'vue'
import Vue3Toastify from 'vue3-toastify'
import App from './App.vue'
import './style.css'
import 'vue3-toastify/dist/index.css'

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => console.log('Service Worker registriert:', reg))
      .catch(err => console.error('SW Registrierung fehlgeschlagen:', err))
  })
}

createApp(App)
  .use(Vue3Toastify, {
    autoClose: 3000,
  } as ToastContainerOptions)
  .mount('#app')
