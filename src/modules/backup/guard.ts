import {
  TABLE_FERTILIZERS,
  TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_SUBSTRATES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS,
  TABLE_WATERING_SCHEMAS,
} from '../db'

export function isImportExportData(value: unknown): value is ImportExportData {
  if (typeof value !== 'object' || value === null)
    return false

  const obj = value as Record<string, unknown>

  const requiredKeys = [
    TABLE_PLANTS,
    TABLE_PLANT_IMAGES,
    TABLE_PLANT_SUBSTRATES,
    TABLE_PLANT_PHASES,
    TABLE_PLANT_WATERING_LOGS,
    TABLE_FERTILIZERS,
    TABLE_WATERING_SCHEMAS,
    TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  ]

  // check all keys exist and are arrays
  return requiredKeys.every(key => Array.isArray(obj[key]))
}
