import type { PlantPhaseRow, PlantPhaseType, PlantRow, PlantSubstrateRow } from './types'
import { hasNumKey, hasOptionalStrKey, hasStrKey } from '../type_guard'

export function isPlantRow(value: any): value is PlantRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasStrKey(value, 'strain')
    && hasOptionalStrKey(value, 'name')
}

export function isPlantSubstrateRow(value: any): value is PlantSubstrateRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasNumKey(value, 'plantId')
    && hasStrKey(value, 'substrate')
    && hasStrKey(value, 'size')
    && hasOptionalStrKey(value, 'info')
}

export function isPlantPhaseRow(value: any): value is PlantPhaseRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasNumKey(value, 'plantId')
    && 'phase' in value && isPlantPhaseType(value.phase)
    && hasStrKey(value, 'startedAt')
    && hasOptionalStrKey(value, 'info')
}

function isPlantPhaseType(value: any): value is PlantPhaseType {
  return typeof value === 'string'
    && (
      value === 'seedling'
      || value === 'seedling'
      || value === 'vegetation'
      || value === 'pre-flower'
      || value === 'flower'
      || value === 'ripening'
      || value === 'harvest'
      || value === 'drying'
      || value === 'curing'
    )
}
