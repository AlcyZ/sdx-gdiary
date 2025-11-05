import type { IDBPDatabase, IDBPObjectStore, IDBPTransaction } from 'idb'
import type { Result } from '../../types'
import type { TABLE_PLANT_IMAGES } from '../db'
import type { EditPlant, NewPlant, NewPlantPhase, NewPlantSubstrate, PlantSubstrate } from './types'
import { wrapSafe } from '../../util.ts'
import {
  getDb,
  INDEX_PLANT_ID,
  INDEX_WATERING_SCHEMA_ID,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_SUBSTRATES,
  TABLE_PLANTS,

} from '../db'

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
    return await wrapSafe(async () => {
      const tx = this.db.transaction([TABLE_PLANTS, TABLE_PLANT_SUBSTRATES, TABLE_PLANT_PHASES], 'readwrite')

      const plantStore = tx.objectStore(TABLE_PLANTS)
      const plantSubstrateStore = tx.objectStore(TABLE_PLANT_SUBSTRATES)
      const plantPhaseStore = tx.objectStore(TABLE_PLANT_PHASES)

      const plantData: Record<string, string | number | undefined> = {
        strain: plant.strain,
        name: plant.name,
      }
      if (plant[INDEX_WATERING_SCHEMA_ID]) {
        plantData[INDEX_WATERING_SCHEMA_ID] = plant[INDEX_WATERING_SCHEMA_ID]
      }

      const plantId = await plantStore.add(plantData)

      await this.insertSubstrate(plantId, plant.substrate, plantSubstrateStore)
      await this.insertPhases(plantId, plant.phases, plantPhaseStore)

      await tx.done
    }, { method: 'save', message: 'Failed to save plant', payload: { plant } })
  }

  public async update(plant: EditPlant) {
    return await wrapSafe(async () => {
      const tx = this.db.transaction([TABLE_PLANTS, TABLE_PLANT_SUBSTRATES, TABLE_PLANT_PHASES], 'readwrite')

      const plantStore = tx.objectStore(TABLE_PLANTS)
      const substrateStore = tx.objectStore(TABLE_PLANT_SUBSTRATES)
      const phaseStore = tx.objectStore(TABLE_PLANT_PHASES)

      await this.deletePlantAssociations(plant.id, TABLE_PLANT_PHASES, tx)
      await this.insertPhases(plant.id, plant.phases, phaseStore)
      await this.insertSubstrate(plant.id, plant.substrate, substrateStore)

      const data: Record<string, string | number | undefined> = {
        strain: plant.strain,
        name: plant.name,
        id: plant.id,
      }
      if (plant[INDEX_WATERING_SCHEMA_ID]) {
        data[INDEX_WATERING_SCHEMA_ID] = plant[INDEX_WATERING_SCHEMA_ID]
      }

      await plantStore.put(data)
      await tx.done
    })
  }

  public async delete(plantId: number) {
    return await wrapSafe(async () => {
      const tx = this.db.transaction([TABLE_PLANTS, TABLE_PLANT_SUBSTRATES, TABLE_PLANT_PHASES], 'readwrite')

      await this.deletePlantAssociations(plantId, TABLE_PLANT_SUBSTRATES, tx)
      await this.deletePlantAssociations(plantId, TABLE_PLANT_PHASES, tx)

      const plantsStore = tx.objectStore(TABLE_PLANTS)
      await plantsStore.delete(plantId)

      await tx.done
    }, { method: 'delete', message: 'Failed to delete plant', payload: { plantId } })
  }

  private async deletePlantAssociations(
    plantId: number,
    table: typeof TABLE_PLANT_IMAGES | typeof TABLE_PLANT_PHASES | typeof TABLE_PLANT_SUBSTRATES,
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

  private async insertSubstrate(
    plantId: IDBValidKey | number,
    substrate: PlantSubstrate | NewPlantSubstrate,
    store: IDBPObjectStore<unknown, string[], typeof TABLE_PLANT_SUBSTRATES, 'readwrite'>,
  ) {
    const data: Record<string, string | undefined | number | IDBValidKey> = {
      substrate: substrate.substrate,
      size: substrate.size,
      info: substrate.info,
      plantId,
    }
    if ('id' in substrate) {
      data.id = substrate.id
    }
    await store.put(data)
  }

  private async insertPhases(
    plantId: IDBValidKey | number,
    phases: Array<NewPlantPhase>,
    store: IDBPObjectStore<unknown, Array<string>, typeof TABLE_PLANT_PHASES, 'readwrite'>,
  ) {
    await Promise.all(
      phases.map(phase => ({
        phase: phase.phase,
        startedAt: phase.startedAt,
        info: phase.info,
        plantId,
      })).map(data => store.add(data)),
    )
  }
}
