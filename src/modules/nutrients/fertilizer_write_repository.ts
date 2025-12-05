import type { IDBPDatabase } from 'idb'
import type { Result } from '../../types'
import type { Fertilizer, NewFertilizer } from './types'
import { err, ok } from '../../util.ts'
import { INDEX_FERTILIZER_ID, TABLE_FERTILIZERS, TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA } from '../db'

export default class FertilizerWriteRepository {
  private readonly db: IDBPDatabase

  constructor(db: IDBPDatabase) {
    this.db = db
  }

  public static create(db: IDBPDatabase): FertilizerWriteRepository {
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

  public async update(fertilizer: Fertilizer): Promise<Result<undefined, unknown>> {
    try {
      const tx = this.db.transaction(TABLE_FERTILIZERS, 'readwrite')
      const store = tx.objectStore(TABLE_FERTILIZERS)

      await store.put(fertilizer)
      return ok(undefined)
    }
    catch (error: unknown) {
      console.error('[FertilizerWriteRepository.update] - failed to update fertilizer:', fertilizer, error)
      return err(error)
    }
  }

  public async delete(fertilizerId: number): Promise<Result<undefined, unknown>> {
    try {
      const tx = this.db.transaction([TABLE_FERTILIZERS, TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA], 'readwrite')

      const store = tx.objectStore(TABLE_FERTILIZERS)
      const pivotStore = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)
      const indexFertilizer = pivotStore.index(INDEX_FERTILIZER_ID)

      for await (const entry of indexFertilizer.iterate(fertilizerId)) {
        await entry.delete()
      }

      await store.delete(fertilizerId)
      await tx.done

      return ok(undefined)
    }
    catch (error) {
      console.error('[FertilizerWriteRepository.delete] - failed to delete fertilizer:', fertilizerId, error)
      return err(error)
    }
  }
}
