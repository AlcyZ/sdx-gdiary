import type { IDBPTransaction } from 'idb'
import type { BackupTxStores } from './types'
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

export default class BackupServiceUtil {
  public unpackStores(
    tx: IDBPTransaction<unknown, BackupTxStores, 'readwrite' | 'readonly'>,
  ) {
    const storePlants = tx.objectStore(TABLE_PLANTS)
    const storePlantImages = tx.objectStore(TABLE_PLANT_IMAGES)
    const storePlantSubstrates = tx.objectStore(TABLE_PLANT_SUBSTRATES)
    const storePlantPhases = tx.objectStore(TABLE_PLANT_PHASES)
    const storePlantWateringLogs = tx.objectStore(TABLE_PLANT_WATERING_LOGS)
    const storeFertilizers = tx.objectStore(TABLE_FERTILIZERS)
    const storeWateringSchema = tx.objectStore(TABLE_WATERING_SCHEMAS)
    const storeFertilizerWateringSchema = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)

    return {
      storePlants,
      storePlantImages,
      storePlantSubstrates,
      storePlantPhases,
      storePlantWateringLogs,
      storeFertilizers,
      storeWateringSchema,
      storeFertilizerWateringSchema,
    }
  }
}
