import type { IDBPDatabase, IDBPObjectStore } from 'idb'
import type { AsyncResult, Result } from '../../types'
import type { TABLE_PLANT_CONTAINER_LOGS } from '../db'
import type {
  NewPlantContainerRow,
  PlantContainerMedium,
} from '../plant_container/types'
import type {
  WithPlantId,
} from '../plants/types'
import type BackupServiceUtil from './backup_service_util.ts'
import type ImportStrategyHelper from './import_strategy_helper.ts'
import type { BackupTxStores, ImportDataV01, ImportStrategy } from './types'
import JSZip from 'jszip'
import { err, ok, safeAsync } from '../../util.ts'
import {
  INDEX_PLANT_ID,
  TABLE_FERTILIZERS,
  TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS,
  TABLE_WATERING_SCHEMAS,
  TABLES_DB,
} from '../db'
import { isFertilizerRow, isFertilizerWateringSchemaRow, isWateringSchemaRow } from '../nutrients/guard.ts'
import {
  isPlantBackupImageRow,
  isPlantPhaseRow,
  isPlantRow,
  isWateringLogRow,
} from '../plants/guard.ts'
import { hasNumKey, hasOptionalStrKey, hasStrKey } from '../type_guard'
import TypeGuardError from '../type_guard/type_guard_error.ts'
import ImportBackupError from './import_backup_error.ts'

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

type PlantSubstrateRow = WithPlantId<{
  substrate: string
  size: string
  info?: string
}>

const GUARDS: Array<[keyof ImportDataV01, (item: any) => item is any]> = [
  [TABLE_PLANTS, isPlantRow],
  [TABLE_PLANT_IMAGES, isPlantBackupImageRow],
  [TABLE_PLANT_PHASES, isPlantPhaseRow],
  [TABLE_PLANT_WATERING_LOGS, isWateringLogRow],
  [TABLE_FERTILIZERS, isFertilizerRow],
  [TABLE_WATERING_SCHEMAS, isWateringSchemaRow],
  [TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, isFertilizerWateringSchemaRow],

  // refactored in v0.2 to plantContainers store
  ['plantSubstrates', isPlantSubstrateRow],
]

function isImportData(value: any): value is ImportDataV01 {
  const result = validateImportData(value)
  if (!result.ok)
    result.error.log()

  return result.ok
}

function validateImportData(value: any): Result<void, TypeGuardError<Array<ValidationError>>> {
  if (typeof value !== 'object' || value === null) {
    return err(TypeGuardError.isNotObject(value))
  }

  const obj = value as Record<string, unknown>
  const errors: Array<ValidationError> = []

  for (const [table, guard] of GUARDS) {
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
      if (!guard(item)) {
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

function isPlantSubstrateRow(value: any): value is PlantSubstrateRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasNumKey(value, INDEX_PLANT_ID)
    && hasStrKey(value, 'substrate')
    && hasStrKey(value, 'size')
    && hasOptionalStrKey(value, 'info')
}

export default class ImportStrategyV01 implements ImportStrategy {
  private readonly helper: ImportStrategyHelper<ImportDataV01>
  private readonly db: IDBPDatabase
  private readonly util: BackupServiceUtil

  constructor(helper: ImportStrategyHelper<ImportDataV01>, db: IDBPDatabase, util: BackupServiceUtil) {
    this.helper = helper
    this.db = db
    this.util = util
  }

  public static create(helper: ImportStrategyHelper<ImportDataV01>, db: IDBPDatabase, util: BackupServiceUtil): ImportStrategyV01 {
    return new ImportStrategyV01(helper, db, util)
  }

  public async importData(file: File): AsyncResult<void, ImportBackupError> {
    return safeAsync(async () => {
      const zip = await JSZip.loadAsync(file)

      const result = await this.helper.tryLoadData(zip, isImportData)
      if (!result.ok)
        throw result.error

      const importResult = await this.import(result.value, zip)
      if (!importResult.ok)
        throw ImportBackupError.error(importResult.error)
    })
  }

  private async import(data: ImportDataV01, zip: JSZip): AsyncResult<void, DOMException> {
    return safeAsync(async () => {
      await Promise.all([
        this.helper.loadImages(data, zip),
        this.util.truncateStores(this.db),
      ])

      const tx = this.db.transaction(TABLES_DB, 'readwrite')
      const {
        storePlants,
        storePlantImages,
        storePlantPhases,
        storePlantContainer,
        storePlantWateringLogs,
        storeFertilizers,
        storeWateringSchema,
        storeFertilizerWateringSchema,
      } = this.util.unpackStores(tx)

      await Promise.all([
        await this.addContainers(storePlantContainer, data),
        this.helper.addData(TABLE_PLANTS, storePlants, data),
        this.helper.addData(TABLE_PLANT_IMAGES, storePlantImages, data),
        this.helper.addData(TABLE_PLANT_PHASES, storePlantPhases, data),
        this.helper.addData(TABLE_PLANT_WATERING_LOGS, storePlantWateringLogs, data),
        this.helper.addData(TABLE_FERTILIZERS, storeFertilizers, data),
        this.helper.addData(TABLE_WATERING_SCHEMAS, storeWateringSchema, data),
        this.helper.addData(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, storeFertilizerWateringSchema, data),
      ])
      await tx.done
    })
  }

  private async addContainers(
    store: IDBPObjectStore<
      unknown,
      BackupTxStores,
      typeof TABLE_PLANT_CONTAINER_LOGS,
      'readwrite'
    >,
    data: ImportDataV01,
  ) {
    const mapSubstrateToMedium = (medium: string): PlantContainerMedium => {
      switch (medium) {
        case 'Erde':
          return 'soil'
        case 'Coco':
          return 'coco'
        case 'Hydro':
          return 'hydro'
        case 'Custom':
        default:
          return 'custom'
      }
    }

    await Promise.all(data.plantSubstrates.map((row) => {
      const data: NewPlantContainerRow = {
        container: `(Migriert, bitte aktualisieren): ${row.size}`,
        medium: mapSubstrateToMedium(row.substrate),
        volume: 1,
        [INDEX_PLANT_ID]: row.plantId,
        notes: row.info,
        timestamp: Date.now(),
      }
      return store.add(data)
    }))
  }
}
