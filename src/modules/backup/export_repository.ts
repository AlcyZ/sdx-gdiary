import type { IDBPDatabase } from 'idb'
import type { AsyncResult } from '../../types'
import type { PlantImageRow } from '../plants/types'
import type BackupServiceUtil from './backup_service_util.ts'
import JSZip from 'jszip'
import { mapMimeToExtension, safeAsync } from '../../util.ts'
import {
  getDb,
  TABLES_DB,
} from '../db'
import { isPlantImageRow } from '../plants/guard.ts'
import { BACKUP_FILENAME_DATA, BACKUP_FILENAME_IMAGE } from './constants.ts'
import ExportBackupError from './export_backup_error.ts'
import { isImportExportData } from './guard.ts'

export default class ExportRepository {
  private readonly db: IDBPDatabase
  private readonly util: BackupServiceUtil

  constructor(db: IDBPDatabase, util: BackupServiceUtil) {
    this.db = db
    this.util = util
  }

  public static async create(util: BackupServiceUtil): Promise<ExportRepository> {
    const db = await getDb()
    return new ExportRepository(db, util)
  }

  public async createBackupZip(): AsyncResult<Blob, ExportBackupError> {
    return safeAsync<Blob, ExportBackupError>(async () => {
      const result = await this.fetchStoresData()
      if (!result.ok)
        throw ExportBackupError.error(result.error)

      if (!isImportExportData(result.value))
        throw ExportBackupError.invalidStoreData(result.value)

      const zip = new JSZip()

      result.value.plantImages.filter((row: any) => isPlantImageRow(row))
        .forEach(image => this.addImgToZip(image, zip))

      const content = JSON.stringify(result.value)
      zip.file(BACKUP_FILENAME_DATA, content)

      return await zip.generateAsync({ type: 'blob' })
    })
  }

  private addImgToZip(image: PlantImageRow, zip: JSZip) {
    const ext = mapMimeToExtension(image.mime)
    const filename = `${BACKUP_FILENAME_IMAGE}${image.id}${ext}`

    zip.file(filename, image.data)
  }

  private async fetchStoresData() {
    return safeAsync<any, DOMException>(async () => {
      const tx = this.db.transaction(TABLES_DB)

      const {
        storePlants,
        storePlantImages,
        storePlantPhases,
        storePlantWateringLogs,
        storeFertilizers,
        storeWateringSchema,
        storeFertilizerWateringSchema,
      } = this.util.unpackStores(tx)

      const results = await Promise.all([
        storePlants.getAll().then(plants => ({ plants })),
        storePlantImages.getAll().then(plantImages => ({ plantImages })),
        storePlantPhases.getAll().then(plantPhases => ({ plantPhases })),
        storePlantWateringLogs.getAll().then(plantWateringLogs => ({ plantWateringLogs })),
        storeFertilizers.getAll().then(fertilizers => ({ fertilizers })),
        storeWateringSchema.getAll().then(wateringSchema => ({ wateringSchema })),
        storeFertilizerWateringSchema.getAll().then(fertilizerWateringSchema => ({ fertilizerWateringSchema })),
      ])

      return Object.assign({}, ...results)
    })
  }
}
