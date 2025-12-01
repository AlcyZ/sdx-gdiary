import type { PlantContainerRow } from './types'
import { INDEX_PLANT_ID } from '../db'
import { hasNumKey, hasOptionalStrKey, hasStrKey } from '../type_guard'

export function isPlantContainerRow(value: any): value is PlantContainerRow {
  return typeof value === 'object'
    && value !== null
    && hasNumKey(value, 'id')
    && hasNumKey(value, INDEX_PLANT_ID)
    && hasNumKey(value, 'date')
    && hasNumKey(value, 'volume')
    && hasStrKey(value, 'medium')
    && hasStrKey(value, 'container')
    && hasOptionalStrKey(value, 'notes')
}
