import type { IDBPDatabase, IDBPTransaction } from 'idb'
import type { Result } from '../../types'
import type { GetPlantError, Plant, PlantPhaseRow, PlantRow, PlantSubstrate } from './types'
import { err, ok } from '../../util.ts'
import { getDb, INDEX_PLANT_ID, TABLE_PLANT_PHASES, TABLE_PLANT_SUBSTRATES, TABLE_PLANTS } from '../db'
import { isPlantPhaseRow, isPlantRow, isPlantSubstrateRow } from './guard.ts'

export default class PlantReadRepository {
  private readonly db: IDBPDatabase

  constructor(db: IDBPDatabase) {
    this.db = db
  }

  public static async create() {
    const db = await getDb()
    return new PlantReadRepository(db)
  }

  public async getAll(): Promise<Array<Plant>> {
    const tx = this.db.transaction([TABLE_PLANTS, TABLE_PLANT_PHASES, TABLE_PLANT_SUBSTRATES])

    const plantStore = tx.objectStore(TABLE_PLANTS)

    const plantData = await plantStore.getAll()
    const plantRows = plantData.filter((row: any): boolean => isPlantRow(row)) as Array<PlantRow>

    const plantResultsPromise = plantRows.map(async (row: PlantRow): Promise<Result<Plant, Array<string>>> => {
      const [substrateResult, phasesResult] = await Promise.all([
        this.fetchSubstrate(row, tx),
        this.fetchPhases(row, tx),
      ])

      if (substrateResult.ok && phasesResult.ok) {
        const phase = this.getCurrentPhase(phasesResult.value)

        return ok({
          id: row.id,
          strain: row.strain,
          name: row.name,
          substrate: substrateResult.value,
          phases: phasesResult.value,
          phase,
          createdAt: 'todo',
          updatedAt: 'todo',
        })
      }

      const errors: Array<string> = []

      if (!substrateResult.ok)
        errors.push(substrateResult.error)
      if (!phasesResult.ok)
        errors.push(phasesResult.error)

      return err(errors)
    })

    const plantResults = await Promise.all(plantResultsPromise)
    for (const result of plantResults) {
      if (!result.ok) {
        console.warn('[PlantReadRepository.getAll] - Found some invalid datasets: ', result.error.join('. '))
      }
    }

    return plantResults.filter(result => result.ok)
      .map(result => result.value)
  }

  public async getById(id: number): Promise<Result<Plant, GetPlantError>> {
    const tx = this.db.transaction([TABLE_PLANTS, TABLE_PLANT_SUBSTRATES, TABLE_PLANT_PHASES])
    const store = tx.objectStore(TABLE_PLANTS)

    const plantData = await store.get(id)
    if (plantData === undefined)
      return err({ kind: 'not-found' })

    if (!isPlantRow(plantData)) {
      console.error('[PlantReadRepository.getById] - found invalid dataset:', plantData)
      return err({ kind: 'invalid-data', message: 'Ungültiger Pflanzendatensatz' })
    }

    const [substrateResult, phasesResult] = await Promise.all([
      this.fetchSubstrate(plantData, tx),
      this.fetchPhases(plantData, tx),
    ])

    if (substrateResult.ok && phasesResult.ok) {
      const phase = this.getCurrentPhase(phasesResult.value)
      return ok({
        id: plantData.id,
        strain: plantData.strain,
        name: plantData.name,
        substrate: substrateResult.value,
        phases: phasesResult.value,
        phase,
        createdAt: 'todo',
        updatedAt: 'todo',
      })
    }

    const message: Array<string> = []
    if (!substrateResult.ok)
      message.push(substrateResult.error)
    if (!phasesResult.ok)
      message.push(phasesResult.error)

    return err({ kind: 'invalid-data', message: message.join('. ') })
  }

  private async fetchSubstrate(plant: PlantRow, tx: IDBPTransaction): Promise<Result<PlantSubstrate, string>> {
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

        return new Date(current.startedAt) > new Date(latest.startedAt)
          ? current
          : latest
      },
      undefined,
    )
  }

  private async fetchPhases(plant: PlantRow, tx: IDBPTransaction): Promise<Result<Array<PlantPhaseRow>, string>> {
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
