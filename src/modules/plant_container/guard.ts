import type { PlantContainerRow } from './types'
import { hasNumKey, hasOptionalStrKey, hasStrKey } from '../type_guard'

export function isPlantContainerRow(value: any): value is PlantContainerRow {
  return typeof value === 'object'
    && value !== null
    && hasNumKey(value, 'id')
    && hasNumKey(value, 'plant_id')
    && hasNumKey(value, 'date')
    && hasNumKey(value, 'volume_liters')
    && hasStrKey(value, 'medium_type')
    && hasStrKey(value, 'container_type')
    && hasOptionalStrKey(value, 'notes')
}
