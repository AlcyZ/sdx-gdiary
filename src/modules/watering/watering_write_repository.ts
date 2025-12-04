import type { IDBPDatabase } from 'idb'
import type { AsyncResult } from '../../types'
import type { NewWateringLog } from './types'
import { safeAsync } from '../../util.ts'
import { TABLE_PLANT_WATERING_LOGS } from '../db'

export default class WateringWriteRepository {
  private readonly db: IDBPDatabase

  constructor(db: IDBPDatabase) {
    this.db = db
  }

  public static create(db: IDBPDatabase) {
    return new WateringWriteRepository(db)
  }

  public async pourPlant(data: NewWateringLog): AsyncResult<void, DOMException> {
    return safeAsync(async () => {
      const tx = this.db.transaction(TABLE_PLANT_WATERING_LOGS, 'readwrite')
      const store = tx.objectStore(TABLE_PLANT_WATERING_LOGS)

      await store.put(data)
      await tx.done
    }, { method: 'pourPlant', message: 'Failed to save watering log', payload: data })
  }

  public async deleteWateringLog(logId: number): AsyncResult<void, DOMException> {
    return safeAsync(async () => {
      const tx = this.db.transaction([TABLE_PLANT_WATERING_LOGS], 'readwrite')
      const store = tx.objectStore(TABLE_PLANT_WATERING_LOGS)

      await store.delete(logId)
      await tx.done
    })
  }
}
