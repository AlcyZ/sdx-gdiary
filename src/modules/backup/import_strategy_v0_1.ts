import type { IDBPDatabase, IDBPObjectStore } from 'idb'
import type { AsyncResult, Result } from '../../types'
import type { TABLE_PLANT_CONTAINER_LOGS } from '../db'
import type { FertilizerRow, FertilizerWateringSchemaRow, WateringSchemaRow } from '../nutrients/types'
import type {
  NewPlantContainerRow,
  PlantContainer,
  PlantContainerMedium,
} from '../plant_container/types'
import type {
  PlantImageRow,
  PlantPhaseRow,
  PlantRow,
  WateringLogRow,
  WithPlantId,
} from '../plants/types'
import type BackupServiceUtil from './backup_service_util.ts'
import type { BackupStoreNames, BackupTxStores, ImportStrategy } from './types'
import JSZip from 'jszip'
import { err, ok, safeAsync, safeParseJson } from '../../util.ts'
import {
  INDEX_PLANT_ID,
  INDEX_SORT,
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
import { BACKUP_FILENAME_DATA } from './constants.ts'
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

interface ImportData {
  [TABLE_PLANTS]: Array<PlantRow>
  [TABLE_PLANT_IMAGES]: Array<PlantImageRow>
  [TABLE_PLANT_PHASES]: Array<PlantPhaseRow>
  [TABLE_PLANT_WATERING_LOGS]: Array<WateringLogRow>
  [TABLE_PLANT_CONTAINER_LOGS]: Array<PlantContainer>
  [TABLE_FERTILIZERS]: Array<FertilizerRow>
  [TABLE_WATERING_SCHEMAS]: Array<WateringSchemaRow>
  [TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA]: Array<FertilizerWateringSchemaRow>

  // refactored in v0.2 to plantContainers store
  plantSubstrates: Array<PlantSubstrateRow>
}

const GUARDS: Array<[keyof ImportData, (item: any) => item is any]> = [
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

function isImportData(value: any): value is ImportData {
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
  private readonly db: IDBPDatabase
  private readonly util: BackupServiceUtil

  constructor(db: IDBPDatabase, util: BackupServiceUtil) {
    this.db = db
    this.util = util
  }

  public static create(db: IDBPDatabase, util: BackupServiceUtil): ImportStrategyV01 {
    return new ImportStrategyV01(db, util)
  }

  public async importData(file: File): AsyncResult<void, ImportBackupError> {
    return safeAsync(async () => {
      const zip = await JSZip.loadAsync(file)

      const json = zip.file(BACKUP_FILENAME_DATA)
      if (!json)
        throw ImportBackupError.dataJsonNotFound(BACKUP_FILENAME_DATA)

      const content = await json.async('text')

      const result = safeParseJson(content, isImportData)
      if (!result.ok)
        throw ImportBackupError.invalidBackupData(result.error)

      const importResult = await this.import(result.value, zip)
      if (!importResult.ok)
        throw ImportBackupError.error(importResult.error)
    })
  }

  private async import(data: ImportData, zip: JSZip): AsyncResult<void, DOMException> {
    return safeAsync(async () => {
      await Promise.all([
        this.loadImages(data, zip),
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
        this.addData(TABLE_PLANTS, storePlants, data),
        this.addData(TABLE_PLANT_IMAGES, storePlantImages, data),
        this.addData(TABLE_PLANT_PHASES, storePlantPhases, data),
        this.addData(TABLE_PLANT_WATERING_LOGS, storePlantWateringLogs, data),
        this.addData(TABLE_FERTILIZERS, storeFertilizers, data),
        this.addData(TABLE_WATERING_SCHEMAS, storeWateringSchema, data),
        this.addData(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, storeFertilizerWateringSchema, data),
      ])
      await tx.done
    })
  }

  private async loadImages(data: ImportData, zip: JSZip) {
    const loadById = this.util.loadImageByIdCallback(zip)

    for (const [i, plantImage] of data[TABLE_PLANT_IMAGES].entries()) {
      const option = await loadById(plantImage.id)

      if (option.exist) {
        data[TABLE_PLANT_IMAGES][i] = {
          [INDEX_PLANT_ID]: plantImage.plantId,
          id: plantImage.id,
          ...option.value,
          [INDEX_SORT]: i + 1,
        }
      }
    }
  }

  private async addData<S extends BackupStoreNames>(
    table: S,
    store: IDBPObjectStore<
      unknown,
      BackupTxStores,
      S,
      'readwrite'
    >,
    data: ImportData,
  ) {
    await Promise.all(data[table].map(row => store.add(row)))
  }

  private async addContainers(
    store: IDBPObjectStore<
      unknown,
      BackupTxStores,
      typeof TABLE_PLANT_CONTAINER_LOGS,
      'readwrite'
    >,
    data: ImportData,
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
        container: `Air Pot`,
        medium: mapSubstrateToMedium(row.substrate),
        volume: 12,
        [INDEX_PLANT_ID]: row.plantId,
        notes: row.info,
        timestamp: 1756112400000,
      }
      return store.add(data)
    }))
  }
}
