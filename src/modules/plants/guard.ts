import type {
  NewWateringLog,
  PlantImageRow,
  PlantPhaseRow,
  PlantPhaseType,
  PlantRow,
  PlantSubstrateRow,
  WateringLog,
  WateringLogFertilizer,
  WateringLogRow,
} from './types'
import { INDEX_PLANT_ID, INDEX_PLANT_IMAGE_ID, INDEX_WATERING_SCHEMA_ID } from '../db'
import { hasNumKey, hasOptionalNumKey, hasOptionalStrKey, hasStrKey } from '../type_guard'

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
}

export function isPlantSubstrateRow(value: any): value is PlantSubstrateRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasNumKey(value, INDEX_PLANT_ID)
    && hasStrKey(value, 'substrate')
    && hasStrKey(value, 'size')
    && hasOptionalStrKey(value, 'info')
}

export function isPlantPhaseRow(value: any): value is PlantPhaseRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasNumKey(value, INDEX_PLANT_ID)
    && 'phase' in value && isPlantPhaseType(value.phase)
    && hasStrKey(value, 'startedAt')
    && hasOptionalStrKey(value, 'info')
}

export function isWateringLogFertilizer(value: any): value is WateringLogFertilizer {
  return typeof value === 'object'
    && value !== null
    && hasStrKey(value, 'name')
    && hasNumKey(value, 'amount')
    && hasOptionalNumKey(value, 'id')
    && hasOptionalStrKey(value, 'manufacturer')
}

export function isNewWateringLog(value: any): value is NewWateringLog {
  return typeof value === 'object'
    && value !== null
    && hasNumKey(value, INDEX_PLANT_ID)
    && hasNumKey(value, 'date')
    && hasNumKey(value, 'amount')
    && hasOptionalNumKey(value, 'ph')
    && hasOptionalNumKey(value, 'ec')
    && Array.isArray(value.fertilizers)
    && value.fertilizers.every(isWateringLogFertilizer)
}

export function isWateringLogRow(value: any): value is WateringLogRow {
  return typeof value === 'object'
    && value !== null
    && hasNumKey(value, 'id')
    && isNewWateringLog(value)
}

export function isWateringLog(value: any): value is WateringLog {
  return typeof value === 'object'
    && value !== null
    && hasNumKey(value, 'id')
    && hasNumKey(value, 'date')
    && hasNumKey(value, 'amount')
    && hasOptionalNumKey(value, 'ph')
    && hasOptionalNumKey(value, 'ec')
    && Array.isArray(value.fertilizers)
    && value.fertilizers.every(isWateringLogFertilizer)
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
