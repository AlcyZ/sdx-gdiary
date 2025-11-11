import type { IDBPDatabase } from 'idb'
import type { AsyncResult } from '../../types'
import type { PlantImageRow } from '../plants/types'
import JSZip from 'jszip'
import { ok, safeAsync } from '../../util.ts'
import {
  getDb,
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
import { isPlantImageRow } from '../plants/guard.ts'

export default class BackupService {
  private readonly db: IDBPDatabase

  constructor(db: IDBPDatabase) {
    this.db = db
  }

  public static async create(): Promise<BackupService> {
    const db = await getDb()
    return new BackupService(db)
  }

  public async createBackup(): AsyncResult<Blob, unknown> {
    const data = await this.fetchStoresData()
    if (!data.ok)
      return data

    const zip = new JSZip()

    data.value.plantImages.filter((row: any) => isPlantImageRow(row))
      .forEach((row: PlantImageRow) => zip.file(`images/image-${row.id}${this.getExtension(row.image)}`, row.image))

    const content = JSON.stringify(data.value)
    zip.file('data.json', content)

    return ok(
      await zip.generateAsync({ type: 'blob' }),
    )
  }

  private async fetchStoresData() {
    return safeAsync(async () => {
      const tx = this.db.transaction(TABLES_DB)

      const storePlants = tx.objectStore(TABLE_PLANTS)
      const storePlantImages = tx.objectStore(TABLE_PLANT_IMAGES)
      const storePlantSubstrates = tx.objectStore(TABLE_PLANT_SUBSTRATES)
      const storePlantPhases = tx.objectStore(TABLE_PLANT_PHASES)
      const storePlantWateringLogs = tx.objectStore(TABLE_PLANT_WATERING_LOGS)
      const storeFertilizers = tx.objectStore(TABLE_FERTILIZERS)
      const storeWateringSchema = tx.objectStore(TABLE_WATERING_SCHEMAS)
      const storeFertilizerWateringSchema = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)

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
