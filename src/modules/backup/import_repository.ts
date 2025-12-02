import type { IDBPDatabase } from 'idb'
import type { AsyncResult } from '../../types'
import type BackupServiceUtil from './backup_service_util.ts'
import type ImportBackupError from './import_backup_error.ts'
import type { ImportVersion } from './types'
import {
  getDb,
} from '../db'

import BackupImporter from './backup_importer.ts'
import ImportStrategyFactory from './import_strategy_factory.ts'

export default class ImportRepository {
  private readonly db: IDBPDatabase
  private readonly util: BackupServiceUtil
  private readonly importer: BackupImporter
  private readonly factory: ImportStrategyFactory

  constructor(
    db: IDBPDatabase,
    util: BackupServiceUtil,
    importer: BackupImporter,
    factory: ImportStrategyFactory,
  ) {
    this.db = db
    this.util = util
    this.importer = importer
    this.factory = factory
  }

  public static async create(util: BackupServiceUtil): Promise<ImportRepository> {
    const db = await getDb()
    const importer = BackupImporter.default()
    const factory = ImportStrategyFactory.create()
    return new ImportRepository(db, util, importer, factory)
  }

  public async importBackup(file: File, version: ImportVersion): AsyncResult<void, ImportBackupError> {
    const strategy = this.factory.createFromVersion(version)
    this.importer.setStrategy(strategy)

    return this.importer.importBackup(file)

    // return safeAsync(async () => {
    //   const zip = await JSZip.loadAsync(file)
    //
    //   const json = zip.file(BACKUP_FILENAME_DATA)
    //   if (!json)
    //     throw ImportBackupError.dataJsonNotFound(BACKUP_FILENAME_DATA)
    //
    //   const content = await json.async('text')
    //
    //   const result = safeParseJson(content, isImportExportData)
    //   if (!result.ok)
    //     throw ImportBackupError.invalidBackupData(result.error)
    //
    //   const importResult = await this.importData(result.value, zip)
    //   if (!importResult.ok)
    //     throw ImportBackupError.error(importResult.error)
    // })
  }

  // private async importData(data: ImportExportData, zip: JSZip): AsyncResult<void, DOMException> {
  //   return safeAsync(async () => {
  //     await Promise.all([
  //       this.loadImages(data, zip),
  //       this.util.truncateStores(this.db),
  //     ])
  //
  //     const tx = this.db.transaction(TABLES_DB, 'readwrite')
  //     const {
  //       storePlants,
  //       storePlantImages,
  //       storePlantPhases,
  //       storePlantWateringLogs,
  //       storeFertilizers,
  //       storeWateringSchema,
  //       storeFertilizerWateringSchema,
  //     } = this.util.unpackStores(tx)
  //
  //     await Promise.all([
  //       this.addData(TABLE_PLANTS, storePlants, data),
  //       this.addData(TABLE_PLANT_IMAGES, storePlantImages, data),
  //       this.addData(TABLE_PLANT_PHASES, storePlantPhases, data),
  //       this.addData(TABLE_PLANT_WATERING_LOGS, storePlantWateringLogs, data),
  //       this.addData(TABLE_FERTILIZERS, storeFertilizers, data),
  //       this.addData(TABLE_WATERING_SCHEMAS, storeWateringSchema, data),
  //       this.addData(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, storeFertilizerWateringSchema, data),
  //     ])
  //     await tx.done
  //   })
  // }

  // private async loadImages(data: ImportExportData, zip: JSZip) {
  //   const loadById = this.util.loadImageByIdCallback(zip)
  //
  //   for (const [i, plantImage] of data[TABLE_PLANT_IMAGES].entries()) {
  //     const option = await loadById(plantImage.id)
  //
  //     if (option.exist) {
  //       data[TABLE_PLANT_IMAGES][i] = {
  //         [INDEX_PLANT_ID]: plantImage.plantId,
  //         id: plantImage.id,
  //         ...option.value,
  //         [INDEX_SORT]: i + 1,
  //       }
  //     }
  //   }
  // }

  // private async addData<S extends BackupStoreNames>(
  //   table: S,
  //   store: IDBPObjectStore<
  //     unknown,
  //     BackupTxStores,
  //     S,
  //     'readwrite'
  //   >,
  //   data: ImportExportData,
  // ) {
  //   data[table].forEach(row => store.add(row))
  // }
}
