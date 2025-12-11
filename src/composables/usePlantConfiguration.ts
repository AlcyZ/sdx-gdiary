import type { Plant } from '../modules/plants/types'
import dayjs from 'dayjs'
import { useConfigurationStore } from '../stores/configurationStore.ts'
import { andThen, some, wrapOption } from '../util.ts'

export function usePlantConfiguration() {
  const configStore = useConfigurationStore()

  function plantListingFilter(plant: Plant): boolean {
    return configStore.plantListingConfiguration.filter === 'show-all' || !plant.isHarvested
  }

  function plantListingSort(lhs: Plant, rhs: Plant): number {
    switch (configStore.plantListingConfiguration.sort) {
      case 'created-desc':
        return _plantListingSortCreatedDesc(lhs, rhs)
      case 'planted-asc':
        return _plantListingSortPlantedAsc(lhs, rhs)
      case 'planted-desc':
        return _plantListingSortPlantedDesc(lhs, rhs)
      case 'default':
      default:
        return 0
    }
  }

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

  return {
    plantListingFilter,
    plantListingSort,
  }
}
