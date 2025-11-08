import type PlantRepository from '../modules/plants/plant_repository'
import type { Plant } from '../modules/plants/types'
import dayjs from 'dayjs'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { REPO_PLANT } from '../di_keys.ts'
import { err } from '../util.ts'

export function usePlant() {
  const plantRepo = inject(REPO_PLANT) as PlantRepository

  const route = useRoute()

  const plant = ref<Plant | null>(null)

  const getPlantAge = (plant: Plant): number => {
    const startDateString = plant.phases.find(phase => phase.phase === 'germination')?.startedAt
      || dayjs().format('YYYY-MM-DDTHH:mm')

    const startDate = dayjs(startDateString)
    const compareDate = plant.phase.phase === 'germination' ? dayjs() : dayjs(plant.phase.startedAt)

    return compareDate.diff(startDate, 'days')
  }

  async function syncPlant() {
    const plantId = Number(route.params.plantId)
    if (Number.isNaN(plantId))
      return

    const plantResult = await plantRepo?.getById(plantId) || err(undefined)
    if (plantResult.ok)
      plant.value = plantResult.value
  }

  return {
    plant,
    plantRepo,
    getPlantAge,
    syncPlant,
  }
}
