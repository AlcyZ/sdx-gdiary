import type { IDBPTransaction } from 'idb'
import type { AsyncResult } from '../../types'
import type { HarvestLogRow, NewHarvest } from './types'
import dayjs from 'dayjs'
import { omitKeys, safeAsync } from '../../util.ts'
import { INDEX_PLANT_ID, TABLE_PLANT_HARVEST_LOGS } from '../db'

export default class HarvestWriteRepository {
  public static create() {
    return new HarvestWriteRepository()
  }

  public async save<
    Tx extends IDBPTransaction<any, ArrayLike<string>, 'readwrite'>,
  >(
    plantId: number,
    harvest: NewHarvest,
    tx: typeof TABLE_PLANT_HARVEST_LOGS extends Tx['objectStoreNames'][number]
      ? Tx
      : never,
  ): AsyncResult<void, DOMException> {
    return safeAsync(async () => {
      const store = tx.objectStore(TABLE_PLANT_HARVEST_LOGS)
      const data: Omit<HarvestLogRow, 'id'> = {
        ...omitKeys(harvest, ['date']),
        timestamp: dayjs(harvest.date).valueOf(),
        [INDEX_PLANT_ID]: plantId,
      }

      await store.add(data)
    })
  }

  public async deleteHarvest<
    Tx extends IDBPTransaction<any, ArrayLike<string>, 'readwrite'>,
  >(
    harvestId: number,
    tx: typeof TABLE_PLANT_HARVEST_LOGS extends Tx['objectStoreNames'][number]
      ? Tx
      : never,
  ): AsyncResult<void, DOMException> {
    return safeAsync(async () => {
      const store = tx.objectStore(TABLE_PLANT_HARVEST_LOGS)
      await store.delete(harvestId)
    })
  }
}
