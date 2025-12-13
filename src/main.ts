/* eslint-disable no-console */

import type { App as VueApp } from 'vue'
import { createPinia } from 'pinia'
import { createApp } from 'vue'
import App from './App.vue'
import {
  REPO_CONFIG,
  REPO_FERTILIZERS,
  REPO_HARVEST,
  REPO_PLANT,
  REPO_WATERING_SCHEMA,
  SERVICE_BACKUP,
} from './di_keys.ts'
import BackupService from './modules/backup/backup_service.ts'
import ConfigurationRepository from './modules/configuration/configuration_repository.ts'
import { getDb } from './modules/db'
import HarvestRepository from './modules/harvest/harvest_repository.ts'
import FertilizerRepository from './modules/nutrients/fertilizer_repository.ts'
import WateringSchemaRepository from './modules/nutrients/watering_schema_repository.ts'
import PlantRepository from './modules/plants/plant_repository.ts'
import { router } from './router.ts'
import './style.css'

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

  registerRouterCallbacks()
  await registerModules(app)
  loadErudaLibraryInDevMode()

  app.mount('#app')
}

function registerRouterCallbacks() {
  router.afterEach((to, from) => {
    if (typeof to.meta.getTransition === 'function') {
      to.meta.transition = to.meta.getTransition(from)
    }
  })
}

async function registerModules(app: VueApp) {
  const db = await getDb()

  const plantRepo = PlantRepository.create(db)
  const fertilizerRepo = FertilizerRepository.create(db)
  const wateringRepo = WateringSchemaRepository.create(db)
  const backupService = BackupService.create(db)
  const harvestRepo = HarvestRepository.create(db)
  const configRepo = ConfigurationRepository.create()

  app.provide(REPO_PLANT, plantRepo)
  app.provide(REPO_FERTILIZERS, fertilizerRepo)
  app.provide(REPO_WATERING_SCHEMA, wateringRepo)
  app.provide(SERVICE_BACKUP, backupService)
  app.provide(REPO_HARVEST, harvestRepo)
  app.provide(REPO_CONFIG, configRepo)
}

function loadErudaLibraryInDevMode() {
  if (!import.meta.env.DEV)
    return

  const script = document.createElement('script')
  script.src = 'https://cdn.jsdelivr.net/npm/eruda'

  script.onload = () => {
    try {
      // @ts-expect-error dynamic loading of script
      window.eruda.init()
    }
    catch (e) {
      console.error('Failed loading eruda library:', e)
    }
  }

  document.body.appendChild(script)
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
