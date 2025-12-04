import type { NewWateringLog, WateringLog, WateringLogFertilizer, WateringLogRow } from './types'
import { INDEX_PLANT_ID } from '../db'
import { hasNumKey, hasOptionalNumKey, hasOptionalStrKey, hasStrKey } from '../type_guard'

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
