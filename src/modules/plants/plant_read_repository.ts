import type { IDBPDatabase, IDBPObjectStore, IDBPTransaction } from 'idb'
import type { Result } from '../../types'
import type { WateringSchema } from '../nutrients/types'
import type { GetPlantError, Plant, PlantPhaseRow, PlantRow, PlantSubstrate, WateringLog } from './types'
import { err, ok, unwrapOrUndefined } from '../../util.ts'
import {
  getDb,
  INDEX_PLANT_ID,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_SUBSTRATES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS,
} from '../db'
import WateringSchemaReadRepository from '../nutrients/watering_schema_read_repository.ts'
import { isPlantPhaseRow, isPlantRow, isPlantSubstrateRow, isWateringLogRow } from './guard.ts'

type PlantRepoTxStores
  = (typeof TABLE_PLANTS
    | typeof TABLE_PLANT_SUBSTRATES
    | typeof TABLE_PLANT_PHASES
    | typeof TABLE_PLANT_WATERING_LOGS
  )[]

export default class PlantReadRepository {
  private readonly db: IDBPDatabase
  private readonly wateringRepo: WateringSchemaReadRepository

  constructor(db: IDBPDatabase, wateringRepo: WateringSchemaReadRepository) {
    this.db = db
    this.wateringRepo = wateringRepo
  }

  public static async create() {
    const db = await getDb()
    const wateringRepo = await WateringSchemaReadRepository.create()
    return new PlantReadRepository(db, wateringRepo)
  }

  public async getAll(): Promise<Array<Plant>> {
    const tx = this.db.transaction([
      TABLE_PLANTS,
      TABLE_PLANT_SUBSTRATES,
      TABLE_PLANT_PHASES,
      TABLE_PLANT_WATERING_LOGS,
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

  public async getById(id: number): Promise<Result<Plant, GetPlantError>> {
    const tx = this.db.transaction([
      TABLE_PLANTS,
      TABLE_PLANT_SUBSTRATES,
      TABLE_PLANT_PHASES,
      TABLE_PLANT_WATERING_LOGS,
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

  private async createPlant(
    plantData: PlantRow,
    tx: IDBPTransaction<unknown, PlantRepoTxStores>,
  ): Promise<Result<Plant, string>> {
    const [substrateResult, phasesResult] = await Promise.all([
      this.fetchSubstrate(plantData, tx),
      this.fetchPhases(plantData, tx),
    ])

    if (substrateResult.ok && phasesResult.ok) {
      const phase = this.getCurrentPhase(phasesResult.value)

      const wateringLogsStore = tx.objectStore(TABLE_PLANT_WATERING_LOGS)
      const wateringLogs = await this.fetchWateringLogs(plantData.id, wateringLogsStore)

      const wateringSchema = await this.fetchPlantsWateringSchema(plantData)

      return ok({
        id: plantData.id,
        strain: plantData.strain,
        name: plantData.name,
        substrate: substrateResult.value,
        phases: phasesResult.value,
        phase,
        wateringSchema,
        wateringLogs,
        createdAt: 'todo',
        updatedAt: 'todo',
      })
    }

    const message: Array<string> = []
    if (!substrateResult.ok)
      message.push(substrateResult.error)
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
    plantId: number,
    store: IDBPObjectStore<unknown, ArrayLike<string>, typeof TABLE_PLANT_WATERING_LOGS>,
  ): Promise<Array<WateringLog>> {
    const index = store.index(INDEX_PLANT_ID)
    const logs = await index.getAll(plantId)

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

  private async fetchSubstrate(
    plant: PlantRow,
    tx: IDBPTransaction<unknown, PlantRepoTxStores>,
  ): Promise<Result<PlantSubstrate, string>> {
    const store = tx.objectStore(TABLE_PLANT_SUBSTRATES)
    const index = store.index(INDEX_PLANT_ID)

    const substrateRow = await index.get(plant.id)
    if (!isPlantSubstrateRow(substrateRow)) {
      console.error('[PlantReadRepository.fetchSubstrate] - substrate not found for plant', plant, substrateRow)
      return err('Pflanze hat kein Substrat zugewiesen')
    }

    return ok({
      id: substrateRow.id,
      substrate: substrateRow.substrate,
      size: substrateRow.size,
      info: substrateRow.info,
    })
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
}
