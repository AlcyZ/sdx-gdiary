import type { IDBPDatabase, IDBPObjectStore } from 'idb'
import type { AsyncResult } from '../../types'
import type BackupServiceUtil from './backup_service_util.ts'
import type { BackupStoreNames, BackupTxStores, ImportExportData } from './types'
import JSZip from 'jszip'
import {
  safeAsync,
  safeParseJson,
} from '../../util.ts'
import {
  getDb,
  INDEX_PLANT_ID,
  TABLE_FERTILIZERS,
  TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_SUBSTRATES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS,
  TABLE_WATERING_SCHEMAS,
  TABLES_DB,
} from '../db'
import { BACKUP_FILENAME_DATA } from './constants.ts'
import { isImportExportData } from './guard.ts'
import ImportBackupError from './import_backup_error.ts'

export default class ImportRepository {
  private readonly db: IDBPDatabase
  private readonly util: BackupServiceUtil

  constructor(db: IDBPDatabase, util: BackupServiceUtil) {
    this.db = db
    this.util = util
  }

  public static async create(util: BackupServiceUtil): Promise<ImportRepository> {
    const db = await getDb()
    return new ImportRepository(db, util)
  }

  public async importBackup(file: File): AsyncResult<void, ImportBackupError> {
    return safeAsync(async () => {
      const zip = await JSZip.loadAsync(file)

      const json = zip.file(BACKUP_FILENAME_DATA)
      if (!json)
        throw ImportBackupError.dataJsonNotFound(BACKUP_FILENAME_DATA)

      const content = await json.async('text')

      const result = safeParseJson(content, isImportExportData)
      if (!result.ok)
        throw ImportBackupError.invalidBackupData(result.error)

      const importResult = await this.importData(result.value, zip)
      if (!importResult.ok)
        throw ImportBackupError.error(importResult.error)
    })
  }

  private async importData(data: ImportExportData, zip: JSZip): AsyncResult<void, DOMException> {
    return safeAsync(async () => {
      await Promise.all([
        this.loadImages(data, zip),
        this.util.truncateStores(this.db),
      ])

      const tx = this.db.transaction(TABLES_DB, 'readwrite')
      const {
        storePlants,
        storePlantImages,
        storePlantSubstrates,
        storePlantPhases,
        storePlantWateringLogs,
        storeFertilizers,
        storeWateringSchema,
        storeFertilizerWateringSchema,
      } = this.util.unpackStores(tx)

      await Promise.all([
        this.addData(TABLE_PLANTS, storePlants, data),
        this.addData(TABLE_PLANT_IMAGES, storePlantImages, data),
        this.addData(TABLE_PLANT_SUBSTRATES, storePlantSubstrates, data),
        this.addData(TABLE_PLANT_PHASES, storePlantPhases, data),
        this.addData(TABLE_PLANT_WATERING_LOGS, storePlantWateringLogs, data),
        this.addData(TABLE_FERTILIZERS, storeFertilizers, data),
        this.addData(TABLE_WATERING_SCHEMAS, storeWateringSchema, data),
        this.addData(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, storeFertilizerWateringSchema, data),
      ])
      await tx.done
    })
  }

  private async loadImages(data: ImportExportData, zip: JSZip) {
    const loadById = this.util.loadImageByIdCallback(zip)

    for (const [i, plantImage] of data[TABLE_PLANT_IMAGES].entries()) {
      const option = await loadById(plantImage.id)

      if (option.exist) {
        data[TABLE_PLANT_IMAGES][i] = {
          [INDEX_PLANT_ID]: plantImage.plantId,
          id: plantImage.id,
          ...option.value,
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
    data: ImportExportData,
  ) {
    data[table].forEach(row => store.add(row))
  }
}
