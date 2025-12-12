import type { IDBPTransaction } from 'idb'
import type { AsyncArray } from '../../types'
import type { Harvest, HarvestLogRow } from './types'
import { INDEX_PLANT_ID, TABLE_PLANT_HARVEST_LOGS } from '../db'
import { isHarvestLogRow } from './guard.ts'

export default class HarvestReadRepository {
  public static create() {
    return new HarvestReadRepository()
  }

  public async getByPlantId<
    TxStores extends ArrayLike<string>,
  >(
    plantId: number,
    tx: typeof TABLE_PLANT_HARVEST_LOGS extends TxStores[number]
      ? IDBPTransaction<unknown, TxStores, 'readonly'>
      : never,
  ): AsyncArray<Harvest> {
    const store = tx.objectStore(TABLE_PLANT_HARVEST_LOGS)
    const index = store.index(INDEX_PLANT_ID)

    const data = await index.getAll(plantId)
    const logs = data.filter(isHarvestLogRow)
      .map(this.mapRow)

    // sort descending by date
    return logs.toSorted((lhs, rhs) => rhs.timestamp - lhs.timestamp)
  }

  private mapRow(row: HarvestLogRow): Harvest {
    const sharedData = {
      id: row.id,
      timestamp: row.timestamp,
      weight: row.weight,
      container: row.container,
      info: row.info,
    }

    return row.type === 'session'
      ? {
          type: 'session',
          state: row.state,
          ...sharedData,
        }
      : {
          type: 'done',
          ...sharedData,
        }
  }
}
