import type { Plant } from '../modules/plants/types'
import dayjs from 'dayjs'

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
    const compareDate = plant.phase.phase === 'germination' ? dayjs() : dayjs(plant.phase.startedAt)

    return compareDate.diff(startDate, 'days')
  }

  return {
    getPlantName,
    getPlantAge,
  }
}
