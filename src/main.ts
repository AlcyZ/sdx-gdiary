/* eslint-disable no-console */

import type { ToastContainerOptions } from 'vue3-toastify'
import { createApp } from 'vue'
import Vue3Toastify from 'vue3-toastify'
import App from './App.vue'
import { REPO_FERTILIZERS, REPO_PLANT, REPO_WATERING_SCHEMA } from './di_keys.ts'
import FertilizerRepository from './modules/nutrients/fertilizer_repository.ts'
import WateringSchemaRepository from './modules/nutrients/watering_schema_repository.ts'
import PlantRepository from './modules/plants/plant_repository.ts'
import { router } from './router.ts'
import './style.css'
import 'vue3-toastify/dist/index.css'

const debug = false

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/sw.js')
      .then(reg => console.log('Service Worker registriert:', reg))
      .catch(err => console.error('SW Registrierung fehlgeschlagen:', err))
  })
}

async function bootstrap() {
  const app = createApp(App)

  app.use(router)
  app.use(Vue3Toastify, {
    autoClose: 3000,
  } as ToastContainerOptions)

  const [plantRepo, fertilizerRepo, wateringRepo] = await Promise.all([
    PlantRepository.create(),
    FertilizerRepository.create(),
    WateringSchemaRepository.create(),
  ])

  app.provide(REPO_PLANT, plantRepo)
  app.provide(REPO_FERTILIZERS, fertilizerRepo)
  app.provide(REPO_WATERING_SCHEMA, wateringRepo)

  app.mount('#app')
}

bootstrap().then(() => {
  if (import.meta.env.DEV && debug)
    console.info('[Mounted VueApp!]')
})
