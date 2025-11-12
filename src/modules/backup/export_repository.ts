import type { IDBPDatabase } from 'idb'
import type { AsyncResult } from '../../types'
import type { PlantImageRow } from '../plants/types'
import type BackupServiceUtil from './backup_service_util.ts'
import JSZip from 'jszip'
import { ok, safeAsync } from '../../util.ts'
import {
  getDb,
  TABLES_DB,
} from '../db'
import { isPlantImageRow } from '../plants/guard.ts'
import { BACKUP_FILENAME_DATA, BACKUP_FILENAME_IMAGE } from './constants.ts'

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

  public async createBackupZip(): AsyncResult<Blob, unknown> {
    const data = await this.fetchStoresData()
    if (!data.ok)
      return data

    const zip = new JSZip()

    data.value.plantImages.filter((row: any) => isPlantImageRow(row))
      .forEach((row: PlantImageRow) => zip.file(`${BACKUP_FILENAME_IMAGE}${row.id}${this.getExtension(row.image)}`, row.image))

    const content = JSON.stringify(data.value)
    zip.file(BACKUP_FILENAME_DATA, content)

    return ok(
      await zip.generateAsync({ type: 'blob' }),
    )
  }

  private async fetchStoresData() {
    return safeAsync(async () => {
      const tx = this.db.transaction(TABLES_DB)

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

      const results = await Promise.all([
        storePlants.getAll().then(plants => ({ plants })),
        storePlantImages.getAll().then(plantImages => ({ plantImages })),
        storePlantSubstrates.getAll().then(plantSubstrates => ({ plantSubstrates })),
        storePlantPhases.getAll().then(plantPhases => ({ plantPhases })),
        storePlantWateringLogs.getAll().then(plantWateringLogs => ({ plantWateringLogs })),
        storeFertilizers.getAll().then(fertilizers => ({ fertilizers })),
        storeWateringSchema.getAll().then(wateringSchema => ({ wateringSchema })),
        storeFertilizerWateringSchema.getAll().then(fertilizerWateringSchema => ({ fertilizerWateringSchema })),
      ])

      return Object.assign({}, ...results)
    })
  }

  private getExtension(image: Blob) {
    switch (image.type) {
      case 'image/jpeg':
        return '.jpg'
      case 'image/webp':
        return '.webp'
      case 'image/png':
      default:
        return '.png'
    }
  }
}
