import type { IDBPDatabase, IDBPTransaction } from 'idb'
import type { Option, Result } from '../../types'
import type { WateringSchema } from '../nutrients/types'
import type {
  GetPlantError,
  Plant,
  PlantImage,
  PlantImageData,
  PlantPhaseRow,
  PlantRow,
  WateringLog,
} from './types'
import { err, none, ok, some, unwrapOrUndefined } from '../../util.ts'
import {
  getDb,
  INDEX_PLANT_ID,
  INDEX_PLANT_IMAGE_ID,
  INDEX_PLANT_IMAGE_SORT,
  TABLE_PLANT_CONTAINER_LOGS,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS,
} from '../db'
import WateringSchemaReadRepository from '../nutrients/watering_schema_read_repository.ts'
import PlantContainerReadRepository from '../plant_container/plant_container_read_repository.ts'
import { isPlantImageRow, isPlantPhaseRow, isPlantRow, isWateringLogRow } from './guard.ts'

type PlantRepoTxStores
  = (typeof TABLE_PLANTS
    | typeof TABLE_PLANT_IMAGES
    | typeof TABLE_PLANT_PHASES
    | typeof TABLE_PLANT_WATERING_LOGS
    | typeof TABLE_PLANT_CONTAINER_LOGS
  )[]

export default class PlantReadRepository {
  private readonly db: IDBPDatabase
  private readonly wateringRepo: WateringSchemaReadRepository
  private readonly containerRepo: PlantContainerReadRepository

  constructor(db: IDBPDatabase, wateringRepo: WateringSchemaReadRepository, containerRepo: PlantContainerReadRepository) {
    this.db = db
    this.wateringRepo = wateringRepo
    this.containerRepo = containerRepo
  }

  public static async create() {
    const [db, wateringRepo] = await Promise.all([
      getDb(),
      WateringSchemaReadRepository.create(),
    ])
    const containerRepo = PlantContainerReadRepository.create()

    return new PlantReadRepository(db, wateringRepo, containerRepo)
  }

  public async getAll(): Promise<Array<Plant>> {
    const tx = this.db.transaction([
      TABLE_PLANTS,
      TABLE_PLANT_IMAGES,
      TABLE_PLANT_PHASES,
      TABLE_PLANT_WATERING_LOGS,
      TABLE_PLANT_CONTAINER_LOGS,
    ])
    const plantStore = tx.objectStore(TABLE_PLANTS)

    const plantData = await plantStore.getAll()
    const plantRows = plantData.filter((row: any): boolean => isPlantRow(row)) as Array<PlantRow>

    const plantResultsPromise = plantRows.map((row: PlantRow) => this.createPlant(row, tx))

    const plantResults = await Promise.all(plantResultsPromise)
    for (const result of plantResults) {
      if (!result.ok) {
        console.warn('[PlantReadRepository.getAll] - Found some invalid datasets: ', result.error)
      }
    }

    return plantResults.filter(result => result.ok)
      .map(result => result.value)
  }

  public async getById(id: number | IDBValidKey): Promise<Result<Plant, GetPlantError>> {
    const tx = this.db.transaction([
      TABLE_PLANTS,
      TABLE_PLANT_IMAGES,
      TABLE_PLANT_PHASES,
      TABLE_PLANT_WATERING_LOGS,
      TABLE_PLANT_CONTAINER_LOGS,
    ])
    const store = tx.objectStore(TABLE_PLANTS)

    const plantData = await store.get(id)
    if (plantData === undefined)
      return err({ kind: 'not-found' })

    if (!isPlantRow(plantData)) {
      console.error('[PlantReadRepository.getById] - found invalid dataset:', plantData)
      return err({ kind: 'invalid-data', message: 'Ungültiger Pflanzendatensatz' })
    }

    const plantResult = await this.createPlant(plantData, tx)
    if (plantResult.ok)
      return ok(plantResult.value)

    return err({ kind: 'invalid-data', message: plantResult.error })
  }

  public async getImageByImageId(plantImageId: number): Promise<Option<PlantImageData>> {
    const tx = this.db.transaction(TABLE_PLANT_IMAGES)
    const store = tx.objectStore(TABLE_PLANT_IMAGES)

    const row = await store.get(plantImageId)
    if (!isPlantImageRow(row)) {
      if (row !== undefined)
        console.error(`[PlantReadRepository.getImageByImageId]: Found image dataset (id: ${plantImageId}), but invalid data`, row)

      return none()
    }

    return some({
      id: row.id,
      data: row.data,
      mime: row.mime,
    })
  }

  private async createPlant(
    plantData: PlantRow,
    tx: IDBPTransaction<unknown, PlantRepoTxStores>,
  ): Promise<Result<Plant, string>> {
    const [
      phasesResult,
      wateringLogs,
      images,
      containers,
    ] = await Promise.all([
      this.fetchPhases(plantData, tx),
      this.fetchWateringLogs(plantData, tx),
      this.fetchImages(plantData, tx),
      this.containerRepo.getAllByPlantId(plantData.id, tx.objectStore(TABLE_PLANT_CONTAINER_LOGS)),
    ])

    if (phasesResult.ok) {
      const phase = this.getCurrentPhase(phasesResult.value)
      const favoritImage = this.getFavoritImage(plantData, images)

      const wateringSchema = await this.fetchPlantsWateringSchema(plantData)

      return ok({
        id: plantData.id,
        strain: plantData.strain,
        name: plantData.name,
        container: containers[0]!, // Todo: Improve!
        phases: phasesResult.value,
        phase,
        wateringSchema,
        logs: {
          watering: wateringLogs,
          containers,
        },
        wateringLogs,
        images,
        favoritImage,
        createdAt: 'todo',
        updatedAt: 'todo',
      })
    }

    const message: Array<string> = []

    if (!phasesResult.ok)
      message.push(phasesResult.error)

    return err(message.join('. '))
  }

  private async fetchPlantsWateringSchema(plant: PlantRow): Promise<WateringSchema | undefined> {
    if (plant.wateringSchemaId === undefined)
      return undefined

    const schemaOption = await this.wateringRepo.getById(plant.wateringSchemaId)
    return unwrapOrUndefined(schemaOption)
  }

  private async fetchWateringLogs(
    plantRow: PlantRow,
    tx: IDBPTransaction<unknown, PlantRepoTxStores>,
  ): Promise<Array<WateringLog>> {
    const store = tx.objectStore(TABLE_PLANT_WATERING_LOGS)
    const index = store.index(INDEX_PLANT_ID)
    const logs = await index.getAll(plantRow.id)

    return logs.filter(isWateringLogRow)
      .map((row): WateringLog => ({
        id: row.id,
        amount: row.amount,
        ec: row.ec,
        ph: row.ph,
        date: row.date,
        fertilizers: row.fertilizers,
      }))
  }

  private getCurrentPhase(phases: Array<PlantPhaseRow>): PlantPhaseRow {
    // returns latest, based on 'startedAt' property
    return phases.reduce(
      (latest: PlantPhaseRow, current: PlantPhaseRow) => {
        if (!latest)
          return current

        const currentDate = new Date(current.startedAt).getTime()
        const latestDate = new Date(latest.startedAt).getTime()

        if (currentDate > latestDate) {
          return current
        }

        if (currentDate === latestDate && current.id > latest.id) {
          return current
        }

        return latest
      },
      undefined,
    )
  }

  private getFavoritImage(plantRow: PlantRow, images: Array<PlantImage>): PlantImage | undefined {
    return images.find(image => image.id === plantRow[INDEX_PLANT_IMAGE_ID])
  }

  private async fetchPhases(
    plant: PlantRow,
    tx: IDBPTransaction<unknown, PlantRepoTxStores>,
  ): Promise<Result<Array<PlantPhaseRow>, string>> {
    const store = tx.objectStore(TABLE_PLANT_PHASES)
    const index = store.index(INDEX_PLANT_ID)

    const phaseData = await index.getAll(plant.id)
    const phaseRows = phaseData.filter((row: any) => isPlantPhaseRow(row)) as Array<PlantPhaseRow>

    if (phaseRows.length === 0) {
      console.error('[PlantReadRepository.fetchPhases] - phases not found for plant', plant)
      return err('Pflanze hat keine Phase zugewiesen')
    }

    return ok(phaseRows)
  }

  private async fetchImages(
    plantRow: PlantRow,
    tx: IDBPTransaction<unknown, PlantRepoTxStores>,
  ): Promise<Array<PlantImage>> {
    const store = tx.objectStore(TABLE_PLANT_IMAGES)
    const index = store.index(INDEX_PLANT_IMAGE_SORT)

    const range = IDBKeyRange.bound(
      [plantRow.id, 0],
      [plantRow.id, Infinity],
    )

    const data = await index.getAll(range)
    return data.filter(row => isPlantImageRow(row))
      .map((row): PlantImage => ({
        id: row.id,
      }))
  }
}
