import type { IDBPDatabase } from 'idb'
import type { AsyncResult, Option, Result } from '../../types'
import type {
  EditPlant,
  GetPlantError,
  NewPlant,
  NewPlantContainer,
  NewWateringLog,
  Plant,
  PlantImage,
  PlantImageData,
  PlantImageSort,
} from './types'
import { err, ok } from '../../util.ts'
import { getDb, TABLE_PLANT_CONTAINER_LOGS } from '../db'
import PlantContainerWriteRepository from '../plant_container/plant_container_write_repository.ts'
import PlantReadRepository from './plant_read_repository.ts'
import PlantWriteRepository from './plant_write_repository.ts'

export default class PlantRepository {
  private readonly db: IDBPDatabase
  private readonly read: PlantReadRepository
  private readonly write: PlantWriteRepository
  private readonly containerWriteRepo: PlantContainerWriteRepository

  constructor(
    db: IDBPDatabase,
    read: PlantReadRepository,
    write: PlantWriteRepository,
    containerWriteRepo: PlantContainerWriteRepository,
  ) {
    this.db = db
    this.read = read
    this.write = write
    this.containerWriteRepo = containerWriteRepo
  }

  public static async create() {
    const db = await getDb()
    const containerWriteRepo = PlantContainerWriteRepository.create()
    const [read, write] = await Promise.all([
      PlantReadRepository.create(db),
      PlantWriteRepository.create(db, containerWriteRepo),
    ])

    return new PlantRepository(db, read, write, containerWriteRepo)
  }

  public async save(plant: NewPlant): Promise<Result<IDBValidKey, unknown>> {
    return this.write.save(plant)
  }

  public async update(plant: EditPlant): Promise<Result<void, unknown>> {
    return this.write.update(plant)
  }

  public async addContainer(plantId: IDBValidKey, container: NewPlantContainer): AsyncResult<void, DOMException> {
    const tx = this.db.transaction([TABLE_PLANT_CONTAINER_LOGS], 'readwrite')
    const result = this.containerWriteRepo.saveNewContainer(plantId, container, tx)

    await tx.done
    return result
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

  public async sortPlantImages(data: Array<PlantImageSort>): AsyncResult<void, DOMException> {
    return this.write.sortPlantImages(data)
  }

  public async markFavorit(plant: Plant, image: PlantImage): Promise<Result<void, unknown>> {
    return this.write.markFavorit(plant, image)
  }
}
