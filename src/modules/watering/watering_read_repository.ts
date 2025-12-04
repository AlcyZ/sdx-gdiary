import type { IDBPTransaction } from 'idb'
import type { AsyncResult } from '../../types'
import type { WateringLog } from './types'
import { safeAsync } from '../../util.ts'
import { INDEX_PLANT_ID, TABLE_PLANT_WATERING_LOGS } from '../db'
import { isWateringLogRow } from './guard.ts'

export default class WateringReadRepository {
  public static create() {
    return new WateringReadRepository()
  }

  public async fetchWateringLogs<TxStores extends ArrayLike<string>>(
    plantId: IDBValidKey,
    tx: typeof TABLE_PLANT_WATERING_LOGS extends TxStores[number]
      ? IDBPTransaction<unknown, TxStores, 'readonly'>
      : never,
  ): AsyncResult<Array<WateringLog>, DOMException> {
    return safeAsync(async () => {
      const store = tx.objectStore(TABLE_PLANT_WATERING_LOGS)
      const index = store.index(INDEX_PLANT_ID)
      const logs = await index.getAll(plantId)

      return logs.filter(isWateringLogRow)
        .map((row): WateringLog => ({
          id: row.id,
          amount: row.amount,
          ec: row.ec,
          ph: row.ph,
          date: row.date,
          fertilizers: row.fertilizers,
        }))
    })
  }
}
