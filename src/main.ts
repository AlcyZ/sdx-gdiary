/* eslint-disable no-console */

import type { ToastContainerOptions } from 'vue3-toastify'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import Vue3Toastify from 'vue3-toastify'
import App from './App.vue'
import { REPO_FERTILIZERS, REPO_HARVEST, REPO_PLANT, REPO_WATERING_SCHEMA, SERVICE_BACKUP } from './di_keys.ts'
import BackupService from './modules/backup/backup_service.ts'
import { getDb } from './modules/db'
import HarvestRepository from './modules/harvest/harvest_repository.ts'
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
  const pinia = createPinia()

  app.use(router)
  app.use(pinia)
  app.use(Vue3Toastify, {
    autoClose: 3000,
  } as ToastContainerOptions)

  // Todo: Inject IDBPDatabase here centrally
  const db = await getDb()

  const [
    plantRepo,
    fertilizerRepo,
    wateringRepo,
    backupService,
  ] = await Promise.all([
    PlantRepository.create(),
    FertilizerRepository.create(),
    WateringSchemaRepository.create(),
    BackupService.create(),

  ])
  const harvestRepo = HarvestRepository.create(db)

  app.provide(REPO_PLANT, plantRepo)
  app.provide(REPO_FERTILIZERS, fertilizerRepo)
  app.provide(REPO_WATERING_SCHEMA, wateringRepo)
  app.provide(SERVICE_BACKUP, backupService)
  app.provide(REPO_HARVEST, harvestRepo)

  app.mount('#app')
}

try {
  bootstrap().then(() => {
    if (import.meta.env.DEV && debug)
      console.info('[Mounted VueApp!] (new version!)')
  }).catch((error) => {
    console.error('Critical application error:', error)
  })
}
catch (error: unknown) {
  console.error('Critical application error:', error)
}
