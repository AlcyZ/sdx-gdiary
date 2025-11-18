import type { ImportExportData } from './types'
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
import { isFertilizerRow, isFertilizerWateringSchemaRow, isWateringSchemaRow } from '../nutrients/guard.ts'
import {
  isPlantBackupImageRow,
  isPlantPhaseRow,
  isPlantRow,
  isPlantSubstrateRow,
  isWateringLogRow,
} from '../plants/guard.ts'

type TableKey = keyof ImportExportData

type GuardedType<T> = T extends (v: any) => v is infer U ? U : never

type ImportExportGuardConfig = {
  [K in TableKey]?:
    | 'allow'
    | ((item: any) => item is any)
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

/**
 * Die Standard-Type Guards, die angewendet werden, wenn kein Custom Guard übergeben wird.
 */
const DEFAULT_GUARDS: Array<[TableKey, (item: any) => item is any]> = [
  [TABLE_PLANTS, isPlantRow],
  [TABLE_PLANT_IMAGES, isPlantBackupImageRow],
  [TABLE_PLANT_SUBSTRATES, isPlantSubstrateRow],
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
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const obj = value as Record<string, unknown>

  const guardAllow = (_v: any): _v is any => true

  // Erstelle eine Map der Standard-Guards für einfachen Zugriff
  const defaultGuardMap = new Map<TableKey, (item: any) => item is any>(DEFAULT_GUARDS)

  return DEFAULT_GUARDS.every(([key]) => {
    const array = obj[key]

    if (!Array.isArray(array)) {
      return false
    }

    let isRowTypeGuard = defaultGuardMap.get(key) || guardAllow // Standard-Guard als Fallback
    const customConfig = config?.[key as keyof Config]

    if (customConfig === 'allow') {
      // Wenn 'allow' gesetzt ist, wird der einfache guardAllow verwendet
      isRowTypeGuard = guardAllow
    }
    else if (typeof customConfig === 'function') {
      // Wenn eine Funktion übergeben wurde, wird sie als Type Guard verwendet
      isRowTypeGuard = customConfig as (item: any) => item is any
    }

    return array.every(isRowTypeGuard)
  })
}

export function isImportExportData(value: unknown): value is ImportExportData {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const obj = value as Record<string, unknown>

  const guardAllow = (_v: any): _v is any => true

  const arrayKeys: Array<[string, (item: any) => item is any]> = [
    [TABLE_PLANTS, isPlantRow],
    [TABLE_PLANT_IMAGES, isPlantBackupImageRow],
    [TABLE_PLANT_SUBSTRATES, isPlantSubstrateRow],
    [TABLE_PLANT_PHASES, isPlantPhaseRow],
    [TABLE_PLANT_WATERING_LOGS, isWateringLogRow],

    [TABLE_FERTILIZERS, guardAllow],
    [TABLE_WATERING_SCHEMAS, guardAllow],
    [TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, guardAllow],
  ]

  return arrayKeys.every(([key, isRowTypeGuard]) => {
    const array = obj[key]

    if (!Array.isArray(array)) {
      return false
    }

    return array.every(isRowTypeGuard)
  })
}
