import type { IDBPDatabase, IDBPIndex, IDBPObjectStore, IDBPTransaction } from 'idb'
import type { AsyncResult, Result } from '../../types'
import type PlantContainerWriteRepository from '../plant_container/plant_container_write_repository.ts'
import type {
  EditPlant,
  NewPlant,
  NewPlantPhase,
  NewWateringLog,
  Plant,
  PlantImage,
  PlantImageSort,
} from './types'
import { safeAsync } from '../../util.ts'
import {
  INDEX_PLANT_ID,
  INDEX_PLANT_IMAGE_ID,
  INDEX_PLANT_IMAGE_SORT,
  INDEX_SORT,
  INDEX_WATERING_SCHEMA_ID,
  TABLE_PLANT_CONTAINER_LOGS,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS,
} from '../db'

export default class PlantWriteRepository {
  private readonly db: IDBPDatabase
  private readonly containerRepo: PlantContainerWriteRepository

  constructor(db: IDBPDatabase, containerRepo: PlantContainerWriteRepository) {
    this.db = db
    this.containerRepo = containerRepo
  }

  public static async create(db: IDBPDatabase, containerRepo: PlantContainerWriteRepository) {
    return new PlantWriteRepository(db, containerRepo)
  }

  public async save(plant: NewPlant): AsyncResult<IDBValidKey, unknown> {
    return await safeAsync(async () => {
      const tx = this.db.transaction([
        TABLE_PLANTS,
        TABLE_PLANT_PHASES,
        TABLE_PLANT_CONTAINER_LOGS,
      ], 'readwrite')

      const plantStore = tx.objectStore(TABLE_PLANTS)
      const plantPhaseStore = tx.objectStore(TABLE_PLANT_PHASES)

      const plantData: Record<string, string | number | undefined> = {
        strain: plant.strain,
        name: plant.name,
      }
      if (plant[INDEX_WATERING_SCHEMA_ID]) {
        plantData[INDEX_WATERING_SCHEMA_ID] = plant[INDEX_WATERING_SCHEMA_ID]
      }

      const plantId = await plantStore.add(plantData)

      await Promise.all([
        this.containerRepo.saveNewContainer(plantId, plant.container, tx),
        this.insertPhases(plantId, plant.phases, plantPhaseStore),
      ])

      await tx.done

      return plantId
    }, { method: 'save', message: 'Failed to save plant', payload: { plant } })
  }

  public async update(plant: EditPlant) {
    return await safeAsync(async () => {
      const tx = this.db.transaction([
        TABLE_PLANTS,
        TABLE_PLANT_PHASES,
        TABLE_PLANT_CONTAINER_LOGS,
      ], 'readwrite')

      const plantStore = tx.objectStore(TABLE_PLANTS)
      const phaseStore = tx.objectStore(TABLE_PLANT_PHASES)

      await Promise.all([
        this.deletePlantAssociations(plant.id, TABLE_PLANT_PHASES, tx),
        this.insertPhases(plant.id, plant.phases, phaseStore),
        this.containerRepo.updateContainer(plant.id, plant.container, tx),
      ])

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

  public async pourPlant(data: NewWateringLog): Promise<Result<void, unknown>> {
    return safeAsync(async () => {
      const tx = this.db.transaction(TABLE_PLANT_WATERING_LOGS, 'readwrite')
      const store = tx.objectStore(TABLE_PLANT_WATERING_LOGS)

      await store.put(data)
      await tx.done
    }, { method: 'pourPlant', message: 'Failed to save watering log', payload: data })
  }

  public async delete(plantId: number) {
    return await safeAsync(async () => {
      const tx = this.db.transaction([
        TABLE_PLANTS,
        TABLE_PLANT_IMAGES,
        TABLE_PLANT_PHASES,
        TABLE_PLANT_CONTAINER_LOGS,
        TABLE_PLANT_WATERING_LOGS,
      ], 'readwrite')

      await Promise.all([
        this.deletePlantAssociations(plantId, TABLE_PLANT_IMAGES, tx),
        this.deletePlantAssociations(plantId, TABLE_PLANT_PHASES, tx),
        this.deletePlantAssociations(plantId, TABLE_PLANT_CONTAINER_LOGS, tx),
        this.deletePlantAssociations(plantId, TABLE_PLANT_WATERING_LOGS, tx),
      ])

      const plantsStore = tx.objectStore(TABLE_PLANTS)
      await plantsStore.delete(plantId)

      await tx.done
    }, { method: 'delete', message: 'Failed to delete plant', payload: { plantId }, kind: 'error' })
  }

  public async deleteLog(logId: number) {
    return safeAsync(async () => {
      const tx = this.db.transaction([TABLE_PLANT_WATERING_LOGS], 'readwrite')
      const store = tx.objectStore(TABLE_PLANT_WATERING_LOGS)

      await store.delete(logId)
      await tx.done
    })
  }

  public async uploadPlantImage(plant: Plant, image: File): Promise<Result<void, DOMException>> {
    return safeAsync<void, DOMException>(async () => {
      const data = await image.arrayBuffer()
      const mime = image.type
      const sort = await this.getNextImageSort(plant.id, this.db)

      const dataset = {
        [INDEX_PLANT_ID]: plant.id,
        data,
        mime,
        [INDEX_SORT]: sort,
      }

      const tx = this.db.transaction(TABLE_PLANT_IMAGES, 'readwrite')
      const store = tx.objectStore(TABLE_PLANT_IMAGES)
      await store.add(dataset)
      await tx.done
    }, { method: 'PlantWriteRepository.uploadPlantImage', message: 'Failed to upload plant' })
  }

  public async markFavorit(plant: Plant, image: PlantImage): Promise<Result<void, unknown>> {
    return safeAsync(async () => {
      const tx = this.db.transaction(TABLE_PLANTS, 'readwrite')
      const store = tx.objectStore(TABLE_PLANTS)

      const row = await store.get(plant.id)
      if (row === undefined)
        throw new Error(`Plant data (id: ${plant.id}) not found`)

      row[INDEX_PLANT_IMAGE_ID] = image.id
      await store.put(row)
      await tx.done
    })
  }

  public async sortPlantImages(data: Array<PlantImageSort>): AsyncResult<void, DOMException> {
    return safeAsync(async () => {
      const tx = this.db.transaction([TABLE_PLANT_IMAGES], 'readwrite')
      const store = tx.objectStore(TABLE_PLANT_IMAGES)
      const index = store.index(INDEX_PLANT_ID)

      const records: Record<number, any> = {}

      for (const dataset of data) {
        for (const [index, image] of dataset.images.entries()) {
          const record = await store.get(image.id)

          if (!Array.isArray(records[dataset.plantId]))
            records[dataset.plantId] = []

          records[dataset.plantId].push({
            ...record,
            [INDEX_PLANT_ID]: dataset.plantId,
            [INDEX_SORT]: index + 1,
          })
        }
      }

      for (const [plantId, images] of Object.entries(records)) {
        await this.deleteImagesByPlantId(plantId, index)

        await Promise.all(
          images.map((record: unknown) => store.put(record)),
        )
      }

      await tx.done
    })
  }

  private async deleteImagesByPlantId(
    plantId: string | number,
    index: IDBPIndex<
      unknown,
      (typeof TABLE_PLANT_IMAGES)[],
      typeof TABLE_PLANT_IMAGES,
      typeof INDEX_PLANT_ID,
      'readwrite'
    >,
  ) {
    const range = IDBKeyRange.only(plantId)

    let cursor = await index.openCursor(range)
    if (cursor) {
      do {
        cursor.delete()
        cursor = await cursor.continue()
      } while (cursor)
    }
  }

  private async deletePlantAssociations(
    plantId: number,
    table: typeof TABLE_PLANT_IMAGES
      | typeof TABLE_PLANT_PHASES
      | typeof TABLE_PLANT_CONTAINER_LOGS
      | typeof TABLE_PLANT_WATERING_LOGS,
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

  private async getNextImageSort(plantId: number | IDBValidKey, db: IDBPDatabase): Promise<number> {
    let highesSort = 0

    const tx = db.transaction(TABLE_PLANT_IMAGES)
    const index = tx.store.index(INDEX_PLANT_IMAGE_SORT)

    const range = IDBKeyRange.bound(
      [plantId, 0],
      [plantId, Infinity],
    )
    const cursor = await index.openCursor(range, 'prev')

    if (cursor) {
      highesSort = cursor.value[INDEX_SORT]
    }
    else {
      console.warn('cursor not found in range:', range)
    }

    await tx.done

    return highesSort + 1
  }
}
