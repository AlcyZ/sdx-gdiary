import type { IDBPDatabase } from 'idb'
import type { Fertilizer } from './types'
import { TABLE_FERTILIZERS } from '../db'
import { isFertilizer } from './guard.ts'

export default class FertilizerReadRepository {
  private readonly db: IDBPDatabase

  constructor(db: IDBPDatabase) {
    this.db = db
  }

  public static create(db: IDBPDatabase): FertilizerReadRepository {
    return new FertilizerReadRepository(db)
  }

  public async getAll(): Promise<Array<Fertilizer>> {
    const data = await this.db.getAll(TABLE_FERTILIZERS)

    return data.filter(isFertilizer)
  }
}
