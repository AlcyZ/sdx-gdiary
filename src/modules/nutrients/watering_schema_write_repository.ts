import type { IDBPDatabase, IDBPObjectStore } from 'idb'
import type { Result } from '../../types'
import type {
  EditedWateringSchema,
  NewWateringSchema,
  NewWateringSchemaFertilizer,
  WateringSchemaFertilizer,
} from './types'
import { err, ok } from '../../util.ts'
import {
  getDb,
  INDEX_FERTILIZER_ID,
  INDEX_WATERING_SCHEMA_ID,
  TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  TABLE_WATERING_SCHEMAS,
} from '../db'

export default class WateringSchemaWriteRepository {
  private readonly db: IDBPDatabase

  constructor(db: IDBPDatabase) {
    this.db = db
  }

  public static async create(): Promise<WateringSchemaWriteRepository> {
    const db = await getDb()
    return new WateringSchemaWriteRepository(db)
  }

  public async save(schema: NewWateringSchema): Promise<Result<IDBValidKey, unknown>> {
    try {
      const tx = this.db.transaction([TABLE_WATERING_SCHEMAS, TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA], 'readwrite')
      const store = tx.objectStore(TABLE_WATERING_SCHEMAS)
      const pivotStore = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)

      const wateringSchema = {
        name: schema.name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      }
      const wateringSchemaId = await store.add(wateringSchema)
      await this.insertSchemaFertilizer(wateringSchemaId, schema.fertilizers, pivotStore)

      await tx.done
      return ok(wateringSchemaId)
    }
    catch (error: unknown) {
      console.error('[WateringSchemaWriteRepository.update] - failed to save schema:', schema, error)
      return err(error)
    }
  }

  public async updateSchema(schema: EditedWateringSchema): Promise<Result<undefined, unknown>> {
    try {
      const tx = this.db.transaction([
        TABLE_WATERING_SCHEMAS,
        TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
      ], 'readwrite')

      const schemaStore = tx.objectStore(TABLE_WATERING_SCHEMAS)
      const pivotStore = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)

      await this.deleteSchemaFertilizerAssociations(schema.id, pivotStore)
      await this.insertSchemaFertilizer(schema.id, schema.fertilizers, pivotStore)

      await schemaStore.put({
        name: schema.name,
        createdAt: Date.now(),
        updatedAt: Date.now(),
        id: schema.id,
      })
      await tx.done

      return ok(undefined)
    }
    catch (error: unknown) {
      console.error('[WateringSchemaWriteRepository.updateSchema] - failed to update schema:', schema, error)
      return err(error)
    }
  }

  public async updateSchemaFertilizer(schemaId: number, schemaFertilizerId: number, data: NewWateringSchemaFertilizer): Promise<Result<undefined, unknown>> {
    try {
      const tx = this.db.transaction(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, 'readwrite')
      const store = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)

      const dataset = {
        [INDEX_WATERING_SCHEMA_ID]: schemaId,
        [INDEX_FERTILIZER_ID]: data.fertilizer.id,
        amount: data.amount,
        id: schemaFertilizerId,
      }

      store.put(dataset)
      return ok(undefined)
    }
    catch (error: unknown) {
      console.error('[WateringSchemaWriteRepository.updateSchemaFertilizer] - failed to update schema fertilizer:', schemaId, schemaFertilizerId, data, error)
      return err(error)
    }
  }

  public async deleteSchema(schemaId: number): Promise<Result<undefined, unknown>> {
    try {
      const tx = this.db.transaction([TABLE_WATERING_SCHEMAS, TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA], 'readwrite')

      const store = tx.objectStore(TABLE_WATERING_SCHEMAS)
      const pivotStore = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)

      await this.deleteSchemaFertilizerAssociations(schemaId, pivotStore)
      await store.delete(schemaId)

      await tx.done

      return ok(undefined)
    }
    catch (error: unknown) {
      console.error('[WateringSchemaWriteRepository.deleteSchema] - failed to delete schema:', schemaId, error)
      return err(error)
    }
  }

  public async deleteSchemaFertilizer(fertilizer: WateringSchemaFertilizer): Promise<Result<undefined, unknown>> {
    try {
      const tx = this.db.transaction(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, 'readwrite')
      const store = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)

      await store.delete(fertilizer.id)
      await tx.done

      return ok(undefined)
    }
    catch (error: unknown) {
      console.error('[WateringSchemaWriteRepository.deleteSchemaFertilizer] - failed to delete schema fertilizer:', fertilizer, error)
      return err(error)
    }
  }

  private async insertSchemaFertilizer(
    wateringSchemaId: IDBValidKey | number,
    fertilizers: Array<NewWateringSchemaFertilizer>,
    pivotStore: IDBPObjectStore<unknown, string[], 'fertilizerWateringSchema', 'readwrite'>,
  ) {
    await Promise.all(
      fertilizers.map(fertilizer => pivotStore.add({
        [INDEX_WATERING_SCHEMA_ID]: wateringSchemaId,
        [INDEX_FERTILIZER_ID]: fertilizer.fertilizer.id,
        amount: fertilizer.amount,
      })),
    )
  }

  private async deleteSchemaFertilizerAssociations(
    schemaId: number,
    pivotStore: IDBPObjectStore<unknown, string[], 'fertilizerWateringSchema', 'readwrite'>,
  ) {
    try {
      const indexSchemaId = pivotStore.index(INDEX_WATERING_SCHEMA_ID)

      const promises = []
      for await (const entry of indexSchemaId.iterate(schemaId)) {
        promises.push(entry.delete())
      }

      await Promise.all(promises)
      return ok(undefined)
    }
    catch (error: unknown) {
      console.error('[WateringSchemaWriteRepository.deleteSchemaFertilizerAssociations] - failed to delete schema associations:', schemaId, error)
      return err(error)
    }
  }
}
