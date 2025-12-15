/* eslint-disable no-console */

import type { App as VueApp } from 'vue'
import type { RouteMeta } from 'vue-router'
import type { Option, TransitionIndex } from './types'
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
import { isTransitionIndex } from './guard.ts'
import BackupService from './modules/backup/backup_service.ts'
import ConfigurationRepository from './modules/configuration/configuration_repository.ts'
import { getDb } from './modules/db'
import HarvestRepository from './modules/harvest/harvest_repository.ts'
import FertilizerRepository from './modules/nutrients/fertilizer_repository.ts'
import WateringSchemaRepository from './modules/nutrients/watering_schema_repository.ts'
import PlantRepository from './modules/plants/plant_repository.ts'
import { router } from './router.ts'
import { ensure } from './util.ts'
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
  const getTransitionIndex = (meta: RouteMeta): Option<TransitionIndex> => ensure(meta.transitionIndex, isTransitionIndex)
  const whenBoth = (
    to: Option<TransitionIndex>,
    from: Option<TransitionIndex>,
    then: (to: TransitionIndex, from: TransitionIndex) => any,
  ) => to.exist && from.exist
    ? then(to.value, from.value)
    : undefined
  const getTransition = (to: TransitionIndex, from: TransitionIndex) => {
    const dx = to.h - from.h
    const dy = to.v - from.v

    return dy !== 0
      ? dy > 0 ? 'slide-up' : 'slide-down'
      : dx > 0 ? 'slide-left' : 'slide-right'
  }

  router.afterEach((to, from) => {
    whenBoth(
      getTransitionIndex(to.meta),
      getTransitionIndex(from.meta),
      (toIdx, fromIdx) => to.meta.transition = getTransition(toIdx, fromIdx),
    )
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
