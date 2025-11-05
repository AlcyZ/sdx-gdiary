import type { IDBPDatabase, IDBPIndex, IDBPObjectStore, IDBPTransaction } from 'idb'
import type { Option } from '../../types'
import type { WateringSchema, WateringSchemaFertilizer } from './types'
import { none, some } from '../../util.ts'
import {
  getDb,
  INDEX_WATERING_SCHEMA_ID,
  TABLE_FERTILIZERS,
  TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  TABLE_WATERING_SCHEMAS,
} from '../db'
import { isFertilizer, isFertilizerWateringSchemaRow, isWateringSchemaRow } from './guard.ts'

export default class WateringSchemaReadRepository {
  private readonly db: IDBPDatabase

  constructor(db: IDBPDatabase) {
    this.db = db
  }

  public static async create(): Promise<WateringSchemaReadRepository> {
    const db = await getDb()
    return new WateringSchemaReadRepository(db)
  }

  public async getAll(): Promise<Array<WateringSchema>> {
    const tx = this.db.transaction([TABLE_WATERING_SCHEMAS, TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, TABLE_FERTILIZERS])

    const schemaStore = tx.objectStore(TABLE_WATERING_SCHEMAS)
    const fertilizerStore = tx.objectStore(TABLE_FERTILIZERS)

    const pivotStore = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)
    const indexSchema = pivotStore.index(INDEX_WATERING_SCHEMA_ID)

    const schemaData = await schemaStore.getAll()
    const schemaRows = schemaData.filter(row => isWateringSchemaRow(row))

    const data: Array<WateringSchema> = []

    for (const schemaRow of schemaRows) {
      const fertilizers = await this.fetchSchemaFertilizer(schemaRow.id, fertilizerStore, indexSchema)

      data.push({
        id: schemaRow.id,
        name: schemaRow.name,
        fertilizers,
      })
    }

    return data
  }

  public async getById(
    id: number,
    txArg?: IDBPTransaction<
      unknown,
      (typeof TABLE_WATERING_SCHEMAS | typeof TABLE_FERTILIZERS | typeof TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)[]
    >,
  ): Promise<Option<WateringSchema>> {
    const tx = txArg || this.db.transaction([TABLE_WATERING_SCHEMAS, TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, TABLE_FERTILIZERS])

    const schemaStore = tx.objectStore(TABLE_WATERING_SCHEMAS)
    const fertilizerStore = tx.objectStore(TABLE_FERTILIZERS)

    const pivotStore = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)
    const indexSchema = pivotStore.index(INDEX_WATERING_SCHEMA_ID)

    const data = await schemaStore.get(id)
    if (!isWateringSchemaRow(data)) {
      return none()
    }

    const fertilizers = await this.fetchSchemaFertilizer(data.id, fertilizerStore, indexSchema)

    return some({
      id: data.id,
      name: data.name,
      fertilizers,
    })
  }

  private async fetchSchemaFertilizer(
    schemaId: number,
    fertilizerStore: IDBPObjectStore<
      unknown,
      (typeof TABLE_WATERING_SCHEMAS | typeof TABLE_FERTILIZERS | typeof TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)[],
        typeof TABLE_FERTILIZERS
    >,
    indexSchema: IDBPIndex<
      unknown,
      (typeof TABLE_WATERING_SCHEMAS | typeof TABLE_FERTILIZERS | typeof TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)[],
      typeof TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
      typeof INDEX_WATERING_SCHEMA_ID
    >,
  ): Promise<Array<WateringSchemaFertilizer>> {
    const pivotData = await indexSchema.getAll(schemaId)
    const pivotRows = pivotData.filter(row => isFertilizerWateringSchemaRow(row))

    const fertilizers: Array<WateringSchemaFertilizer> = []

    for (const pivotRow of pivotRows) {
      const fertilizer = await fertilizerStore.get(pivotRow.fertilizerId)
      if (!isFertilizer(fertilizer)) {
        console.warn('[WateringSchemaReadRepository.getAll] - invalid fertilizer data:', fertilizer, pivotRow)
        continue
      }

      fertilizers.push({
        id: pivotRow.id,
        fertilizer,
        amount: pivotRow.amount,
      })
    }

    return fertilizers
  }
}
