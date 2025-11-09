import type { WateringSchema } from '../modules/nutrients/types'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { REPO_WATERING_SCHEMA } from '../di_keys.ts'
import { none } from '../util.ts'

export const useWateringSchemaStore = defineStore('wateringSchema', () => {
  const wateringSchemaRepo = inject(REPO_WATERING_SCHEMA)

  const route = useRoute()

  const wateringSchema = ref<WateringSchema | null>(null)
  const wateringSchemas = ref<Array<WateringSchema>>([])

  const syncSchema = async (schemaId: number) => {
    const wateringSchemaResult = await wateringSchemaRepo?.getById(schemaId) || none()
    if (!wateringSchemaResult?.exist)
      return

    wateringSchema.value = wateringSchemaResult.value
  }

  const syncSchemaWithRoute = async () => {
    const schemaId = Number(route.params.schemaId)
    if (Number.isNaN(schemaId))
      return

    await syncSchema(schemaId)
  }

  const syncWateringSchemas = async () => wateringSchemas.value = await wateringSchemaRepo?.getAll() || []

  return {
    wateringSchema,
    wateringSchemas,
    syncSchema,
    syncSchemaWithRoute,
    syncWateringSchemas,
  }
})
