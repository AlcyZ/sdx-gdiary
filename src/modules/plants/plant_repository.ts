import type { Result } from '../../types'
import type { EditPlant, GetPlantError, NewPlant, NewWateringLog, Plant } from './types'
import { err, ok } from '../../util.ts'
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

  public async update(plant: EditPlant): Promise<Result<undefined, unknown>> {
    return this.write.update(plant)
  }

  public async pourPlant(data: NewWateringLog): Promise<Result<undefined, unknown>> {
    return this.write.pourPlant(data)
  }

  public async getAll(): Promise<Array<Plant>> {
    return this.read.getAll()
  }

  public async getById(id: number): Promise<Result<Plant, GetPlantError>> {
    return this.read.getById(id)
  }

  public async delete(plantId: number): Promise<Result<undefined, string>> {
    try {
      await this.write.delete(plantId)
      return ok(undefined)
    }
    catch (e) {
      console.error('[PlantRepository.delete] - failed to delete plant with id:', plantId, e)
      return err('Es ist ein Fehler beim löschen der Pflanze aufgetreten')
    }
  }

  public async deleteLog(logId: number): Promise<Result<undefined, unknown>> {
    return this.write.deleteLog(logId)
  }
}
