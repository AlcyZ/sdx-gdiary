import type { Fertilizer, FertilizerWateringSchemaRow, WateringSchemaRow } from './types'
import { hasNumKey, hasOptionalStrKey, hasStrKey } from '../type_guard'

export function isFertilizer(value: any): value is Fertilizer {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasStrKey(value, 'name')
    && hasOptionalStrKey(value, 'manufacturer')
}

export function isWateringSchemaRow(value: any): value is WateringSchemaRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasStrKey(value, 'name')
    && hasNumKey(value, 'createdAt')
    && hasNumKey(value, 'updatedAt')
}

export function isFertilizerWateringSchemaRow(value: any): value is FertilizerWateringSchemaRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasNumKey(value, 'wateringSchemaId')
    && hasNumKey(value, 'fertilizerId')
    && hasNumKey(value, 'amount')
}
