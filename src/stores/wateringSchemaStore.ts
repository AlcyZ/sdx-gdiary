import type { WateringSchema } from '../modules/nutrients/types'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { REPO_WATERING_SCHEMA } from '../di_keys.ts'

export const useWateringSchemaStore = defineStore('wateringSchema', () => {
  const wateringSchemaRepo = inject(REPO_WATERING_SCHEMA)

  const wateringSchemas = ref<Array<WateringSchema>>([])

  const syncWateringSchemas = async () => await wateringSchemaRepo?.getAll() || []

  return {
    wateringSchemas,
    syncWateringSchemas,
  }
})
