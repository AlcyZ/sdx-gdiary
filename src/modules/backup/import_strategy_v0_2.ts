import type { IDBPDatabase } from 'idb'
import type { AsyncResult } from '../../types'
import type BackupServiceUtil from './backup_service_util.ts'
import type ImportStrategyHelper from './import_strategy_helper.ts'
import type { ImportExportData, ImportStrategy } from './types'
import JSZip from 'jszip'
import { safeAsync } from '../../util.ts'
import {
  TABLE_FERTILIZERS,
  TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  TABLE_PLANT_CONTAINER_LOGS,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS,
  TABLE_WATERING_SCHEMAS,
  TABLES_DB,
} from '../db'
import { isImportExportData } from './guard.ts'
import ImportBackupError from './import_backup_error.ts'

export default class ImportStrategyV02 implements ImportStrategy {
  private readonly helper: ImportStrategyHelper<ImportExportData>
  private readonly db: IDBPDatabase
  private readonly util: BackupServiceUtil

  constructor(helper: ImportStrategyHelper<ImportExportData>, db: IDBPDatabase, util: BackupServiceUtil) {
    this.helper = helper
    this.db = db
    this.util = util
  }

  public static create(helper: ImportStrategyHelper<ImportExportData>, db: IDBPDatabase, util: BackupServiceUtil): ImportStrategyV02 {
    return new ImportStrategyV02(helper, db, util)
  }

  public async importData(file: File): AsyncResult<void, ImportBackupError> {
    return safeAsync(async () => {
      const zip = await JSZip.loadAsync(file)

      const result = await this.helper.tryLoadData(zip, isImportExportData)
      if (!result.ok)
        throw result.error

      const importResult = await this.import(result.value, zip)
      if (!importResult.ok)
        throw ImportBackupError.error(importResult.error)
    })
  }

  private async import(data: ImportExportData, zip: JSZip): AsyncResult<void, DOMException> {
    return safeAsync(async () => {
      await Promise.all([
        this.helper.loadImages(data, zip),
        // this.util.truncateStores(this.db),
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
        this.helper.addData(TABLE_PLANTS, storePlants, data),
        this.helper.addData(TABLE_PLANT_IMAGES, storePlantImages, data),
        this.helper.addData(TABLE_PLANT_PHASES, storePlantPhases, data),
        this.helper.addData(TABLE_PLANT_CONTAINER_LOGS, storePlantContainer, data),
        this.helper.addData(TABLE_PLANT_WATERING_LOGS, storePlantWateringLogs, data),
        this.helper.addData(TABLE_FERTILIZERS, storeFertilizers, data),
        this.helper.addData(TABLE_WATERING_SCHEMAS, storeWateringSchema, data),
        this.helper.addData(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, storeFertilizerWateringSchema, data),
      ])
      await tx.done
    })
  }
}
