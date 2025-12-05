import type { IDBPTransaction } from 'idb'
import type { AsyncResult } from '../../types'
import type { HarvestLogRow, NewHarvest } from './types'
import dayjs from 'dayjs'
import { omitKeys, safeAsync } from '../../util.ts'
import { TABLE_PLANT_HARVEST_LOGS } from '../db'

export default class HarvestWriteRepository {
  public static create() {
    return new HarvestWriteRepository()
  }

  public async save<
    Tx extends IDBPTransaction<any, ArrayLike<string>, 'readwrite'>,
  >(
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
      }

      await store.add(data)
      await tx.done
    })
  }
}
