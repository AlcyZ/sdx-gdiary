import type { HasId, HasTimestamps, WithId } from '../../types'
import type { INDEX_WATERING_SCHEMA_ID } from '../db'
import type { WateringSchema } from '../nutrients/types'

interface NewPlantSubstrate {
  substrate: string
  size: string
  info?: string
}

interface NewPlantPhase {
  phase: PlantPhaseType
  startedAt: string
  info?: string
}

interface NewPlant {
  strain: string
  name?: string
  substrate: NewPlantSubstrate
  phases: Array<NewPlantPhase>
  [INDEX_WATERING_SCHEMA_ID]?: number
}

type EditPlant = Omit<WithId<NewPlant, number>, 'substrate'> & {
  substrate: PlantSubstrate
  [INDEX_WATERING_SCHEMA_ID]?: number
}

type PlantSubstrate = WithId<NewPlantSubstrate, number>
type PlantPhase = WithId<NewPlantPhase, number>

type Plant = {
  strain: string
  name?: string
  substrate: PlantSubstrate
  phase: PlantPhase
  phases: Array<PlantPhase>
  wateringSchema?: WateringSchema
  wateringLogs: Array<WateringLog>
} & HasId<number> & HasTimestamps

type PlantSubstrateType = 'Erde' | 'Coco' | 'Hydro' | 'Custom'
type PlantPhaseType = 'germination'
  | 'seedling'
  | 'vegetation'
  | 'pre-flower'
  | 'flower'
  | 'ripening'
  | 'harvest'
  | 'drying'
  | 'curing'

interface PlantRow {
  id: number
  strain: string
  name?: string
  [INDEX_WATERING_SCHEMA_ID]?: number
}

type WithPlantId<T> = WithId<T, number> & { plantId: number }

type PlantSubstrateRow = WithPlantId<{
  substrate: string
  size: string
  info?: string
}, number>

type PlantPhaseRow = WithPlantId<{
  phase: PlantPhaseType
  startedAt: string
  info?: string
}, number>

interface GetPlantNotFoundError {
  kind: 'not-found'
}

interface GetPlantErrorInvalidData {
  kind: 'invalid-data'
  message: string
}

type GetPlantError = GetPlantNotFoundError | GetPlantErrorInvalidData

interface WateringLogFertilizer {
  id?: number
  name: string
  manufacturer?: string
  amount: number
}

interface NewWateringLog {
  plantId: number
  date: number
  amount: number
  ph?: number
  ec?: number
  fertilizers: Array<WateringLogFertilizer>
}

type WateringLogRow = WithId<NewWateringLog, number>
type WateringLog = Omit<WateringLogRow, 'plantId'>
