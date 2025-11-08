import type { Plant } from '../modules/plants/types'
import dayjs from 'dayjs'

export function usePlant() {
  const getPlantAge = (plant: Plant): number => {
    const startDateString = plant.phases.find(phase => phase.phase === 'germination')?.startedAt
      || dayjs().format('YYYY-MM-DDTHH:mm')

    const startDate = dayjs(startDateString)
    const compareDate = plant.phase.phase === 'germination' ? dayjs() : dayjs(plant.phase.startedAt)

    return compareDate.diff(startDate, 'days')
  }

  return {
    getPlantAge,
  }
}
