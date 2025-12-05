import type { IDBPDatabase } from 'idb'
import type { Result } from '../../types'
import type { Fertilizer, NewFertilizer } from './types'
import FertilizerReadRepository from './fertilizer_read_repository.ts'
import FertilizerWriteRepository from './fertilizer_write_repository.ts'

export default class FertilizerRepository {
  private readonly read: FertilizerReadRepository
  private readonly write: FertilizerWriteRepository

  constructor(read: FertilizerReadRepository, write: FertilizerWriteRepository) {
    this.read = read
    this.write = write
  }

  public static create(db: IDBPDatabase): FertilizerRepository {
    const read = FertilizerReadRepository.create(db)
    const write = FertilizerWriteRepository.create(db)

    return new FertilizerRepository(read, write)
  }

  public async getAll(): Promise<Array<Fertilizer>> {
    return this.read.getAll()
  }

  public async save(fertilizer: NewFertilizer): Promise<Result<IDBValidKey, unknown>> {
    return this.write.save(fertilizer)
  }

  public async update(fertilizer: Fertilizer): Promise<Result<undefined, unknown>> {
    return this.write.update(fertilizer)
  }

  public async delete(fertilizerId: number): Promise<Result<undefined, unknown>> {
    return this.write.delete(fertilizerId)
  }
}
