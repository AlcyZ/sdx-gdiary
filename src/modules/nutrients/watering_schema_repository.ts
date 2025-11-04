import type { Result } from '../../types'
import type { NewWateringSchema } from './types'
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

  public async getAll() {
    return this.read.getAll()
  }
}
