import type { Plant } from '../modules/plants/types'
import type { Option } from '../types'
import dayjs from 'dayjs'
import { none, some } from '../util.ts'

export function usePlant() {
  function getPlantName(plant: Plant) {
    return plant.name !== undefined && plant.name !== ''
      ? `${plant.name} (${plant.strain})`
      : plant.strain
  }

  function getPlantAge(plant: Plant): number {
    const startDateString = plant.phases.find(phase => phase.phase === 'germination')?.startedAt
      || dayjs().format('YYYY-MM-DDTHH:mm')

    const startDate = dayjs(startDateString)
    return dayjs().diff(startDate, 'days')
  }

  function getFlowerDay(plant: Plant): Option<number> {
    const flowerStart = plant.phases.find(phase => phase.phase === 'pre-flower')?.startedAt
    if (flowerStart === undefined)
      return none()

    const startDate = dayjs(flowerStart)
    const diff = dayjs().diff(startDate, 'days')

    return some(diff)
  }

  return {
    getPlantName,
    getPlantAge,
    getFlowerDay,
  }
}
