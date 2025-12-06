import type { NewWateringSchemaFertilizer, WateringSchema } from '../modules/nutrients/types'
import type WateringSchemaRepository from '../modules/nutrients/watering_schema_repository.ts'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { REPO_WATERING_SCHEMA } from '../di_keys.ts'

export const useWateringSchemaStore = defineStore('wateringSchema', () => {
  const wateringSchemaRepo = inject(REPO_WATERING_SCHEMA) as WateringSchemaRepository

  const route = useRoute()

  const wateringSchema = ref<WateringSchema | null>(null)
  const wateringSchemas = ref<Array<WateringSchema>>([])

  const syncSchema = async (schemaId: number) => {
    const wateringSchemaResult = await wateringSchemaRepo.getById(schemaId)
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

  const syncWateringSchemas = async () => wateringSchemas.value = await wateringSchemaRepo.getAll()

  const updateSchemaFertilizer = async (schemaId: number, schemaFertilizerId: number, data: NewWateringSchemaFertilizer) => {
    const result = await wateringSchemaRepo.updateSchemaFertilizer(schemaId, schemaFertilizerId, data)
    if (result.ok)
      await syncWateringSchemas()

    return result
  }

  return {
    wateringSchema,
    wateringSchemas,
    syncSchema,
    syncSchemaWithRoute,
    syncWateringSchemas,
    updateSchemaFertilizer,
  }
})
