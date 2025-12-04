import type {
  PlantImageRow,
  PlantPhaseRow,
  PlantPhaseType,
  PlantRow,
} from './types'
import { INDEX_PLANT_ID, INDEX_PLANT_IMAGE_ID, INDEX_SORT, INDEX_WATERING_SCHEMA_ID } from '../db'
import {
  hasEmptyObjectKey,
  hasNumKey,
  hasOptionalNumKey,
  hasOptionalStrKey,
  hasStrKey,
} from '../type_guard'

export function isPlantRow(value: any): value is PlantRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasStrKey(value, 'strain')
    && hasOptionalStrKey(value, 'name')
    && hasOptionalNumKey(value, INDEX_WATERING_SCHEMA_ID)
    && hasOptionalNumKey(value, INDEX_PLANT_IMAGE_ID)
}

export function isPlantImageRow(value: any): value is PlantImageRow {
  return typeof value === 'object'
    && value !== null
    && hasNumKey(value, 'id')
    && hasNumKey(value, INDEX_PLANT_ID)
    && hasStrKey(value, 'mime')
    && value.data instanceof ArrayBuffer
    && hasNumKey(value, INDEX_SORT)
}

export function isPlantBackupImageRow(value: any): value is PlantImageRow {
  return typeof value === 'object'
    && value !== null
    && hasNumKey(value, 'id')
    && hasNumKey(value, INDEX_PLANT_ID)
    && hasStrKey(value, 'mime')
    && hasEmptyObjectKey(value, 'data')
}

export function isPlantPhaseRow(value: any): value is PlantPhaseRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasNumKey(value, INDEX_PLANT_ID)
    && 'phase' in value && isPlantPhaseType(value.phase)
    && hasStrKey(value, 'startedAt')
    && hasOptionalStrKey(value, 'info')
}

function isPlantPhaseType(value: any): value is PlantPhaseType {
  return typeof value === 'string'
    && (
      value === 'germination'
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
