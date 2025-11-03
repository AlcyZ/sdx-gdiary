import type { IDBPDatabase } from 'idb'
import type { Result } from '../../types'
import type { NewFertilizer } from './types'
import { err, ok } from '../../util.ts'
import { getDb, TABLE_FERTILIZERS } from '../db'

export default class FertilizerWriteRepository {
  private readonly db: IDBPDatabase

  constructor(db: IDBPDatabase) {
    this.db = db
  }

  public static async create(): Promise<FertilizerWriteRepository> {
    const db = await getDb()
    return new FertilizerWriteRepository(db)
  }

  public async save(fertilizer: NewFertilizer): Promise<Result<IDBValidKey, unknown>> {
    try {
      const tx = this.db.transaction(TABLE_FERTILIZERS, 'readwrite')
      const store = tx.objectStore(TABLE_FERTILIZERS)

      const fertilizerId = await store.add(fertilizer)
      return ok(fertilizerId)
    }
    catch (error: unknown) {
      return err(error)
    }
  }
}
