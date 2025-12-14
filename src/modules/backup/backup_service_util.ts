import type { IDBPDatabase, IDBPTransaction } from 'idb'
import type JSZip from 'jszip'
import type { BackupTxStores } from './types'
import { andThen, getExtension, mapExtensionToMime, some, unwrapOr, wrapOption } from '../../util.ts'
import {
  TABLE_FERTILIZERS,
  TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  TABLE_PLANT_CONTAINER_LOGS,
  TABLE_PLANT_HARVEST_LOGS,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS,
  TABLE_WATERING_SCHEMAS,
  TABLES_DB,
} from '../db'
import { BACKUP_FILENAME_IMAGE } from './constants.ts'

export default class BackupServiceUtil {
  public unpackStores<Mode extends IDBTransactionMode = 'readonly'>(
    tx: IDBPTransaction<unknown, BackupTxStores, Mode>,
  ) {
    const storePlants = tx.objectStore(TABLE_PLANTS)
    const storePlantImages = tx.objectStore(TABLE_PLANT_IMAGES)
    const storePlantPhases = tx.objectStore(TABLE_PLANT_PHASES)
    const storePlantContainer = tx.objectStore(TABLE_PLANT_CONTAINER_LOGS)
    const storePlantWateringLogs = tx.objectStore(TABLE_PLANT_WATERING_LOGS)
    const storeFertilizers = tx.objectStore(TABLE_FERTILIZERS)
    const storeWateringSchema = tx.objectStore(TABLE_WATERING_SCHEMAS)
    const storeHarvestLogs = tx.objectStore(TABLE_PLANT_HARVEST_LOGS)
    const storeFertilizerWateringSchema = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)

    return {
      storePlants,
      storePlantImages,
      storePlantPhases,
      storePlantContainer,
      storePlantWateringLogs,
      storeFertilizers,
      storeWateringSchema,
      storeHarvestLogs,
      storeFertilizerWateringSchema,
    }
  }

  public async isDbEmpty(db: IDBPDatabase): Promise<boolean> {
    const tx = db.transaction(TABLES_DB)
    const counts = await Promise.all(TABLES_DB.map(table => tx.objectStore(table).count()))

    return counts.every(count => count === 0)
  }

  public async truncateStores(db: IDBPDatabase) {
    const tx = db.transaction(TABLES_DB, 'readwrite')
    const promises: Array<Promise<void>> = []

    for (const storeName of TABLES_DB)
      promises.push(tx.objectStore(storeName).clear())

    await Promise.all(promises)
    await tx.done
  }

  public loadImageByIdCallback(zip: JSZip) {
    const files = Object.values(zip.files).filter(f => !f.dir)
    const findById = (id: number) => wrapOption(files.find(file => file.name.startsWith(`${BACKUP_FILENAME_IMAGE}${id}`)))

    return async (id: number) => andThen(
      findById(id),
      async (file) => {
        const data = await file.async('arraybuffer')
        const mime = mapExtensionToMime(
          unwrapOr(getExtension(file.name), ''),
        )

        return some({
          data,
          mime,
        })
      },
    )
  }
}
