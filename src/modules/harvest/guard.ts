import type { DryingState, HarvestBase, HarvestFinished, HarvestLogRow, HarvestSession } from './types'
import { INDEX_PLANT_ID } from '../db'
import { hasNumKey, hasOptionalNumKey, hasOptionalStrKey } from '../type_guard'

function isDryingState(value: any): value is DryingState {
  return value === 'wet' || value === 'semi_dry' || value === 'dry'
}

function isHarvestBase(value: any): value is HarvestBase {
  return typeof value === 'object'
    && value !== null
    && hasNumKey(value, 'id')
    && hasNumKey(value, INDEX_PLANT_ID)
    && hasNumKey(value, 'timestamp')
    && hasOptionalNumKey(value, 'weight')
    && hasOptionalStrKey(value, 'container')
    && hasOptionalStrKey(value, 'info')
}

function isHarvestSession(value: any): value is HarvestSession {
  return typeof value === 'object'
    && value !== null
    && value.type === 'session'
    && isDryingState(value.state)
}

function isHarvestFinished(value: any): value is HarvestFinished {
  return typeof value === 'object'
    && value !== null
    && value.type === 'done'
}

export function isHarvestLogRow(value: any): value is HarvestLogRow {
  if (typeof value !== 'object' || value === null) {
    console.warn('[DBG:GUARD]: No Object', value)
    return false
  }

  if (!isHarvestBase(value)) {
    console.warn('[DBG:GUARD]: Not base', value)
    return false
  }

  return isHarvestSession(value) || isHarvestFinished(value)
}
