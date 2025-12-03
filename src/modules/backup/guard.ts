import type { Result } from '../../types'
import type { ImportExportData } from './types'
import { err, ok } from '../../util.ts'
import {
  TABLE_FERTILIZERS,
  TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  TABLE_PLANT_CONTAINER_LOGS,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS,
  TABLE_WATERING_SCHEMAS,
} from '../db'
import { isFertilizerRow, isFertilizerWateringSchemaRow, isWateringSchemaRow } from '../nutrients/guard.ts'
import { isPlantContainerRow } from '../plant_container/guard.ts'
import {
  isPlantBackupImageRow,
  isPlantPhaseRow,
  isPlantRow,
  isWateringLogRow,
} from '../plants/guard.ts'
import TypeGuardError from '../type_guard/type_guard_error.ts'

type TableKey = keyof ImportExportData

type GuardedType<T> = T extends (v: any) => v is infer U ? U : never

type ImportExportGuardConfig = {
  [K in TableKey]?:
    | 'allow'
    | ((item: any) => item is any)
} & {
  [key: string]:
    | 'allow'
    | ((item: any) => item is any)
    | undefined
}

type DynamicTypeGuardedData<
  Config extends ImportExportGuardConfig,
> = {
  [K in TableKey]:
  K extends keyof Config
    ? (
        Config[K] extends 'allow'
          ? Array<any>
          : (
              Config[K] extends (item: any) => item is any
                ? Array<GuardedType<Config[K]>>
                : ImportExportData[K]
            )
      )
    : ImportExportData[K]
}

interface NotArrayError {
  kind: 'not-array'
  data: unknown
}
interface GuardFailedError {
  kind: 'guard-failed'
  index: number
  item: unknown
}

type ValidationError = (NotArrayError | GuardFailedError) & {
  table: string
}

/**
 * Die Standard-Type Guards, die angewendet werden, wenn kein Custom Guard übergeben wird.
 */
const DEFAULT_GUARDS: Array<[TableKey, (item: any) => item is any]> = [
  [TABLE_PLANTS, isPlantRow],
  [TABLE_PLANT_IMAGES, isPlantBackupImageRow],
  [TABLE_PLANT_PHASES, isPlantPhaseRow],
  [TABLE_PLANT_WATERING_LOGS, isWateringLogRow],
  [TABLE_FERTILIZERS, isFertilizerRow],
  [TABLE_WATERING_SCHEMAS, isWateringSchemaRow],
  [TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, isFertilizerWateringSchemaRow],
]

export function isImportExportDataCustom<
  Config extends ImportExportGuardConfig,
>(
  value: unknown,
  config?: Config,
): value is DynamicTypeGuardedData<Config> {
  const result = validateImportExportDataCustom(value, config)
  if (!result.ok)
    result.error.log()

  return result.ok
}

export function validateImportExportDataCustom<
  Config extends ImportExportGuardConfig,
>(
  value: unknown,
  config?: Config,
): Result<void, TypeGuardError<Array<ValidationError>>> {
  if (typeof value !== 'object' || value === null) {
    return err(TypeGuardError.isNotObject(value))
  }

  const obj = value as Record<string, unknown>

  const defaultGuardMap = new Map<TableKey, (item: any) => item is any>(DEFAULT_GUARDS)
  const keysToCheck = new Set<string>(DEFAULT_GUARDS.map(([key]) => key))

  if (config) {
    for (const key of Object.keys(config)) {
      keysToCheck.add(key)
    }
  }

  const errors: Array<ValidationError> = []
  for (const table of keysToCheck) {
    if (!(table in obj)) {
      continue
    }

    const data = obj[table]

    if (!Array.isArray(data)) {
      errors.push({
        kind: 'not-array',
        table,
        data,
      })
      continue
    }

    const guardAllow = (_v: any): _v is any => true
    let isRowTypeGuard = defaultGuardMap.get(table as TableKey) || guardAllow
    const customConfig = config?.[table as keyof Config]

    if (customConfig === 'allow') {
      isRowTypeGuard = guardAllow
    }
    else if (typeof customConfig === 'function') {
      isRowTypeGuard = customConfig as (item: any) => item is any
    }

    for (const [index, item] of data.entries()) {
      if (!isRowTypeGuard(item)) {
        errors.push({
          kind: 'guard-failed',
          table,
          index,
          item,
        })
      }
    }
  }

  return errors.length > 0
    ? err(TypeGuardError.from(value, errors))
    : ok()
}

export function isImportExportData(value: unknown): value is ImportExportData {
  const result = validateImportExportData(value)
  if (!result.ok)
    result.error.log()

  return result.ok
}

export function validateImportExportData(value: unknown): Result<void, TypeGuardError<Array<ValidationError>>> {
  if (typeof value !== 'object' || value === null) {
    return err(TypeGuardError.isNotObject(value))
  }

  const obj = value as Record<string, unknown>

  const arrayKeys: Array<[string, (item: any) => item is any]> = [
    [TABLE_PLANTS, isPlantRow],
    [TABLE_PLANT_IMAGES, isPlantBackupImageRow],
    [TABLE_PLANT_PHASES, isPlantPhaseRow],
    [TABLE_PLANT_WATERING_LOGS, isWateringLogRow],
    [TABLE_PLANT_CONTAINER_LOGS, isPlantContainerRow],
    [TABLE_FERTILIZERS, isFertilizerRow],
    [TABLE_WATERING_SCHEMAS, isWateringSchemaRow],
    [TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, isFertilizerWateringSchemaRow],
  ]

  const errors: Array<ValidationError> = []

  for (const [table, isRowGuard] of arrayKeys) {
    const data = obj[table]

    if (!Array.isArray(data)) {
      errors.push({
        kind: 'not-array',
        data,
        table,
      })
      continue
    }

    for (const [index, item] of data.entries()) {
      if (!isRowGuard(item)) {
        errors.push({
          kind: 'guard-failed',
          index,
          table,
          item,
        })
      }
    }
  }

  return errors.length > 0
    ? err(TypeGuardError.from(value, errors))
    : ok()
}
