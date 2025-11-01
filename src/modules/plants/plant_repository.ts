import type { Result } from '../../types'
import type { NewPlant, Plant } from './types'
import PlantReadRepository from './plant_read_repository.ts'
import PlantWriteRepository from './plant_write_repository.ts'

export default class PlantRepository {
  private readonly read: PlantReadRepository
  private readonly write: PlantWriteRepository

  constructor(read: PlantReadRepository, write: PlantWriteRepository) {
    this.read = read
    this.write = write
  }

  public static async create() {
    const [read, write] = await Promise.all([
      PlantReadRepository.create(),
      PlantWriteRepository.create(),
    ])

    return new PlantRepository(read, write)
  }

  public async save(plant: NewPlant): Promise<Result<undefined, unknown>> {
    return this.write.save(plant)
  }

  public async getAll(): Promise<Result<Array<Plant>, unknown>> {
    return this.read.getAll()
  }
}
