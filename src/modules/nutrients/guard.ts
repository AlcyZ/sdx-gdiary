import type { Fertilizer } from './types'
import { hasNumKey, hasOptionalStrKey, hasStrKey } from '../type_guard'

export function isFertilizer(value: any): value is Fertilizer {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasStrKey(value, 'name')
    && hasOptionalStrKey(value, 'manufacturer')
}
