import type { IDBPObjectStore } from 'idb'
import type { TABLE_PLANT_CONTAINER_LOGS } from '../db'
import type { PlantContainer } from './types'
import { omitKeys } from '../../util.ts'
import { INDEX_PLANT_ID } from '../db'
import { isPlantContainerRow } from './guard.ts'

export default class PlantContainerReadRepository {
  public static create() {
    return new PlantContainerReadRepository()
  }

  public async getAllByPlantId(
    plantId: number,
    store: IDBPObjectStore<unknown, typeof TABLE_PLANT_CONTAINER_LOGS[], typeof TABLE_PLANT_CONTAINER_LOGS>,
  ): Promise<Array<PlantContainer>> {
    const index = store.index(INDEX_PLANT_ID)

    const rows = await index.getAll(plantId)

    return rows.filter(isPlantContainerRow)
      .map(row => omitKeys(row, ['plantId']))
  }
}
