import type { Plant } from '../modules/plants/types'
import type { Option } from '../types'
import dayjs from 'dayjs'
import { useConfigurationStore } from '../stores/configurationStore.ts'
import { andThen, none, some, wrapOption } from '../util.ts'

function _plantListingSortCreatedDesc(lhs: Plant, rhs: Plant): number {
  return rhs.id - lhs.id
}

function _plantListingSortPlantedAsc(lhs: Plant, rhs: Plant): number {
  const getTimestamp = (plant: Plant) => andThen(
    wrapOption(
      plant.phases.find(phase => phase.phase === 'germination')?.startedAt,
    ),
    startedAt => some(dayjs(startedAt).valueOf()),
  )

  const lhsTimestamp = getTimestamp(lhs)
  const rhsTimestamp = getTimestamp(rhs)

  if (lhsTimestamp.exist && rhsTimestamp.exist)
    return lhsTimestamp.value - rhsTimestamp.value

  return lhsTimestamp.exist
    ? -1
    : rhsTimestamp.exist
      ? 1
      : 0
}

function _plantListingSortPlantedDesc(lhs: Plant, rhs: Plant): number {
  return _plantListingSortPlantedAsc(lhs, rhs) * -1
}

function _plantListingSortWhenNotBothWatered(lhs: Plant, rhs: Plant): Option<number> {
  const isWatered = (plant: Plant) => plant.logs.watering.length > 0
  const isLhsWatered = isWatered(lhs)
  const isRhsWatered = isWatered(rhs)

  if (!isLhsWatered && !isRhsWatered)
    return some(0)

  if (isLhsWatered !== isRhsWatered)
    return some(Number(isRhsWatered) - Number(isLhsWatered))

  return none()
}

function _plantListingSortWateredAsc(lhs: Plant, rhs: Plant): number {
  const notBothWatered = _plantListingSortWhenNotBothWatered(lhs, rhs)
  if (notBothWatered.exist)
    return notBothWatered.value

  const lastWateringDate = (plant: Plant) => plant.logs
    .watering
    .map(watering => watering.date)
    .reduce((previous, current) => current > previous ? current : previous)

  return lastWateringDate(lhs) - lastWateringDate(rhs)
}

function _plantListingSortWateredDesc(lhs: Plant, rhs: Plant): number {
  const notBothWatered = _plantListingSortWhenNotBothWatered(lhs, rhs)
  if (notBothWatered.exist)
    return notBothWatered.value

  const lastWateringDate = (plant: Plant) => plant.logs
    .watering
    .map(watering => watering.date)
    .reduce((previous, current) => current > previous ? current : previous)

  return lastWateringDate(rhs) - lastWateringDate(lhs)
}

export function usePlantConfiguration() {
  const configStore = useConfigurationStore()

  function plantListingFilter(plant: Plant): boolean {
    switch (configStore.plantListingConfiguration.filter) {
      case 'show-all':
        return true
      case 'show-harvested':
        return plant.isHarvested
      case 'hide-harvested':
        return !plant.isHarvested
      default:
        throw new Error(`[usePlantConfiguration.plantListingFilter]:
          Filter '${configStore.plantListingConfiguration.filter}' is not implemented`)
    }
  }

  function plantListingSort(lhs: Plant, rhs: Plant): number {
    switch (configStore.plantListingConfiguration.sort) {
      case 'created-desc':
        return _plantListingSortCreatedDesc(lhs, rhs)
      case 'planted-asc':
        return _plantListingSortPlantedAsc(lhs, rhs)
      case 'planted-desc':
        return _plantListingSortPlantedDesc(lhs, rhs)
      case 'watered-asc':
        return _plantListingSortWateredAsc(lhs, rhs)
      case 'watered-desc':
        return _plantListingSortWateredDesc(lhs, rhs)
      case 'default':
      default:
        return 0
    }
  }

  return {
    plantListingFilter,
    plantListingSort,
  }
}
