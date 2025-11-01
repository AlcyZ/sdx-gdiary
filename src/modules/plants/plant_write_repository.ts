import type { IDBPDatabase, IDBPTransaction } from 'idb'
import type { Result } from '../../types'
import type { NewPlant } from './types'
import { err, ok } from '../../util.ts'
import { getDb, INDEX_PLANT_ID, TABLE_PLANT_PHASES, TABLE_PLANT_SUBSTRATES, TABLE_PLANTS } from '../db'

export default class PlantWriteRepository {
  private readonly db: IDBPDatabase

  constructor(db: IDBPDatabase) {
    this.db = db
  }

  public static async create() {
    const db = await getDb()
    return new PlantWriteRepository(db)
  }

  public async save(plant: NewPlant): Promise<Result<undefined, unknown>> {
    try {
      const tx = this.db.transaction([TABLE_PLANTS, TABLE_PLANT_SUBSTRATES, TABLE_PLANT_PHASES], 'readwrite')

      const plantStore = tx.objectStore(TABLE_PLANTS)
      const plantSubstrateStore = tx.objectStore(TABLE_PLANT_SUBSTRATES)
      const plantPhaseStore = tx.objectStore(TABLE_PLANT_PHASES)

      const plantData = {
        strain: plant.strain,
        name: plant.name,
      }

      const plantId = await plantStore.add(plantData)

      const plantSubstrateData = {
        substrate: plant.substrate.substrate,
        size: plant.substrate.size,
        info: plant.substrate.info,
        plantId,
      }
      await plantSubstrateStore.add(plantSubstrateData)

      const plantPhaseData = {
        phase: plant.phase.phase,
        startedAt: plant.phase.startedAt,
        info: plant.phase.info,
        plantId,
      }
      await plantPhaseStore.add(plantPhaseData)

      await tx.done

      return ok(undefined)
    }
    catch (error) {
      return err(error)
    }
  }

  public async delete(plantId: number) {
    const tx = this.db.transaction([TABLE_PLANTS, TABLE_PLANT_SUBSTRATES, TABLE_PLANT_PHASES], 'readwrite')

    await this.deletePlantAssociations(plantId, TABLE_PLANT_SUBSTRATES, tx)
    await this.deletePlantAssociations(plantId, TABLE_PLANT_PHASES, tx)

    const plantsStore = tx.objectStore(TABLE_PLANTS)
    await plantsStore.delete(plantId)

    await tx.done
    return ok(undefined)
  }

  private async deletePlantAssociations(
    plantId: number,
    table: string,
    tx: IDBPTransaction<unknown, Array<string>, 'readwrite'>,
  ) {
    const store = tx.objectStore(table)
    const index = store.index(INDEX_PLANT_ID)

    const keys = await index.getAllKeys(plantId)

    const promises = []
    for (const key of keys) {
      promises.push(
        store.delete(key),
      )
    }

    await Promise.all(promises)
  }
}
