import type { IDBPTransaction } from 'idb'
import type { AsyncResult } from '../../types'
import type { EditPlantContainer, NewPlantContainer } from '../plants/types'
import type { NewPlantContainerRow, PlantContainerRow } from './types'
import dayjs from 'dayjs'
import { omitKeys, safeAsync } from '../../util.ts'
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
        ...omitKeys(container, ['datetime']),
        timestamp: dayjs(container.datetime).valueOf(),
        [INDEX_PLANT_ID]: plantId,
      }

      await store.add(data)
    })
  }

  public async updateContainer<
    TxStores extends ArrayLike<string>,
  >(
    plantId: IDBValidKey,
    container: EditPlantContainer,
    tx: typeof TABLE_PLANT_CONTAINER_LOGS extends TxStores[number]
      ? IDBPTransaction<unknown, TxStores, 'readwrite'>
      : never,
  ): AsyncResult<void, DOMException> {
    return safeAsync(async () => {
      const store = tx.objectStore(TABLE_PLANT_CONTAINER_LOGS)
      const data: PlantContainerRow = {
        ...omitKeys(container, ['datetime']),
        timestamp: dayjs(container.datetime).valueOf(),
        [INDEX_PLANT_ID]: plantId,
      }

      await store.put(data)
    })
  }
}
