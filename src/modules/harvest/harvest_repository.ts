import type { IDBPDatabase } from 'idb'
import type { AsyncResult } from '../../types'
import type { Harvest, NewHarvest } from './types'
import { TABLE_PLANT_HARVEST_LOGS } from '../db'
import HarvestWriteRepository from './harvest_write_repository.ts'

export default class HarvestRepository {
  private readonly db: IDBPDatabase
  private readonly write: HarvestWriteRepository

  constructor(db: IDBPDatabase, write: HarvestWriteRepository) {
    this.db = db
    this.write = write
  }

  public static create(db: IDBPDatabase) {
    const write = HarvestWriteRepository.create()

    return new HarvestRepository(db, write)
  }

  public async save(plantId: number, harvest: NewHarvest): AsyncResult<void, DOMException> {
    const tx = this.db.transaction([
      TABLE_PLANT_HARVEST_LOGS,
    ], 'readwrite')

    const result = await this.write.save(plantId, harvest, tx)
    await tx.done

    return result
  }

  public async update(plantId: number, harvest: Harvest): AsyncResult<void, DOMException> {
    const tx = this.db.transaction([
      TABLE_PLANT_HARVEST_LOGS,
    ], 'readwrite')

    const result = await this.write.updateHarvest(plantId, harvest, tx)
    await tx.done

    return result
  }

  public async delete(harvestId: number): AsyncResult<void, DOMException> {
    const tx = this.db.transaction([
      TABLE_PLANT_HARVEST_LOGS,
    ], 'readwrite')

    const result = await this.write.deleteHarvest(harvestId, tx)
    await tx.done

    return result
  }
}
