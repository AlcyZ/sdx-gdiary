import type { AsyncResult, Option, Result } from '../../types'
import type { EditPlant, GetPlantError, NewPlant, NewWateringLog, Plant, PlantImage, PlantImageData } from './types'
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

  public async save(plant: NewPlant): Promise<Result<IDBValidKey, unknown>> {
    return this.write.save(plant)
  }

  public async update(plant: EditPlant): Promise<Result<void, unknown>> {
    return this.write.update(plant)
  }

  public async pourPlant(data: NewWateringLog): Promise<Result<void, unknown>> {
    return this.write.pourPlant(data)
  }

  public async getAll(): Promise<Array<Plant>> {
    return this.read.getAll()
  }

  public async getById(id: number | IDBValidKey): Promise<Result<Plant, GetPlantError>> {
    return this.read.getById(id)
  }

  public async getImageByImageId(plantImageId: number): Promise<Option<PlantImageData>> {
    return this.read.getImageByImageId(plantImageId)
  }

  public async delete(plantId: number): Promise<Result<void, unknown>> {
    return await this.write.delete(plantId)
  }

  public async deleteLog(logId: number): Promise<Result<void, unknown>> {
    return this.write.deleteLog(logId)
  }

  public async uploadPlantImage(plant: Plant, image: File): Promise<Result<void, DOMException>> {
    return this.write.uploadPlantImage(plant, image)
  }

  public async uploadPlantImages(plant: Plant, images: FileList): AsyncResult<void, Array<DOMException>> {
    const results = await Promise.all(
      Array.from(images).map(image => this.uploadPlantImage(plant, image)),
    )

    if (results.every(result => result.ok))
      return ok()

    const errors = results.filter(result => !result.ok).map(result => result.error)
    return err(errors)
  }

  public async markFavorit(plant: Plant, image: PlantImage): Promise<Result<void, unknown>> {
    return this.write.markFavorit(plant, image)
  }
}
