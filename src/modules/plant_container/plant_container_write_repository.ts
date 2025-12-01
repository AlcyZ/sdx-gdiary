import type { IDBPTransaction } from 'idb'
import type { AsyncResult } from '../../types'
import type { NewPlantContainer } from '../plants/types'
import type { NewPlantContainerRow } from './types'
import { safeAsync } from '../../util.ts'
import { INDEX_PLANT_ID, TABLE_PLANT_CONTAINER_LOGS } from '../db'

export default class PlantContainerWriteRepository {
  public static create() {
    return new PlantContainerWriteRepository()
  }

  public async saveNewContainer<
    TxStores extends ArrayLike<string>,
  >(
    plantId: IDBValidKey,
    container: NewPlantContainer,
    tx: typeof TABLE_PLANT_CONTAINER_LOGS extends TxStores[number]
      ? IDBPTransaction<unknown, TxStores, 'readwrite'>
      : never,
  ): AsyncResult<void, DOMException> {
    return safeAsync(async () => {
      const store = tx.objectStore(TABLE_PLANT_CONTAINER_LOGS)

      const data: NewPlantContainerRow = {
        ...container,
        date: Date.now(),
        [INDEX_PLANT_ID]: plantId,
      }

      store.add(data)
    })
  }
}
