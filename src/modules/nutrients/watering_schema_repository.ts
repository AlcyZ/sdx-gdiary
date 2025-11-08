import type { Option, Result } from '../../types'
import type {
  EditedWateringSchema,
  NewWateringSchema,
  NewWateringSchemaFertilizer,
  WateringSchema,
  WateringSchemaFertilizer,
} from './types'
import WateringSchemaReadRepository from './watering_schema_read_repository.ts'
import WateringSchemaWriteRepository from './watering_schema_write_repository.ts'

export default class WateringSchemaRepository {
  private readonly read: WateringSchemaReadRepository
  private readonly write: WateringSchemaWriteRepository

  constructor(read: WateringSchemaReadRepository, write: WateringSchemaWriteRepository) {
    this.read = read
    this.write = write
  }

  public static async create(): Promise<WateringSchemaRepository> {
    const [read, write] = await Promise.all([
      WateringSchemaReadRepository.create(),
      WateringSchemaWriteRepository.create(),
    ])
    return new WateringSchemaRepository(read, write)
  }

  public async save(schema: NewWateringSchema): Promise<Result<IDBValidKey, unknown>> {
    return this.write.save(schema)
  }

  public async updateSchema(schema: EditedWateringSchema): Promise<Result<undefined, unknown>> {
    return this.write.updateSchema(schema)
  }

  public async updateSchemaFertilizer(schemaId: number, schemaFertilizerId: number, data: NewWateringSchemaFertilizer): Promise<Result<undefined, unknown>> {
    return this.write.updateSchemaFertilizer(schemaId, schemaFertilizerId, data)
  }

  public async deleteSchema(schemaId: number): Promise<Result<undefined, unknown>> {
    return this.write.deleteSchema(schemaId)
  }

  public async deleteSchemaFertilizer(fertilizer: WateringSchemaFertilizer): Promise<Result<undefined, unknown>> {
    return this.write.deleteSchemaFertilizer(fertilizer)
  }

  public async getAll() {
    return this.read.getAll()
  }

  public async getById(shemaId: number): Promise<Option<WateringSchema>> {
    return this.read.getById(shemaId)
  }
}
