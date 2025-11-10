import type { Plant } from '../modules/plants/types'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { REPO_PLANT } from '../di_keys.ts'
import { err } from '../util.ts'

export const usePlantStore = defineStore('store', () => {
  const plantRepo = inject(REPO_PLANT)

  const route = useRoute()

  const plant = ref<Plant | null>(null)
  const plants = ref<Array<Plant>>([])

  const syncPlant = async (plantId: number) => {
    const plantResult = await plantRepo?.getById(plantId) || err(undefined)
    if (plantResult.ok)
      plant.value = plantResult.value
  }
  const syncPlantWithRoute = async () => {
    const plantId = Number(route.params.plantId)
    if (Number.isNaN(plantId))
      return

    await syncPlant(plantId)
  }
  const syncPlants = async () => {
    plants.value = await plantRepo?.getAll() || []
  }

  const deleteWateringLog = async (logId: number) => {
    const result = await plantRepo?.deleteLog(logId) || err(undefined)
    if (result.ok) {
      await Promise.all([
        syncPlants(),
        syncPlantWithRoute(),
      ])
    }

    return result
  }

  return {
    plant,
    plants,
    syncPlant,
    syncPlantWithRoute,
    syncPlants,
    deleteWateringLog,
  }
})
