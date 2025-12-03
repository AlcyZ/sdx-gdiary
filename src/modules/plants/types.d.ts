import type { HasId, HasTimestamps, WithId } from '../../types'
import type { type INDEX_PLANT_ID, type INDEX_PLANT_IMAGE_ID, INDEX_SORT, type INDEX_WATERING_SCHEMA_ID } from '../db'
import type { WateringSchema } from '../nutrients/types'
import type { PlantContainer, PlantContainerMedium } from '../plant_container/types'

interface NewPlantContainer {
  container: string
  medium: PlantContainerMedium
  volume: number
  notes?: string
  datetime: string
}

type EditPlantContainer = WithId<NewPlantContainer, number>

interface NewPlantPhase {
  phase: PlantPhaseType
  startedAt: string
  info?: string
}

interface NewPlant {
  strain: string
  name?: string
  container: NewPlantContainer
  phases: Array<NewPlantPhase>
  [INDEX_WATERING_SCHEMA_ID]?: number
}

type EditPlant = Omit<WithId<NewPlant, number>, 'container'> & {
  container: EditPlantContainer
  [INDEX_WATERING_SCHEMA_ID]?: number
}

type PlantPhase = WithId<NewPlantPhase, number>
type PlantImage = HasId<number>
type PlantImageData = PlantImage & {
  data: ArrayBuffer
  mime: string
}

interface PlantLogs {
  watering: Array<WateringLog>
  containers: Array<PlantContainer>
}

type Plant = {
  strain: string
  name?: string
  container: PlantContainer
  phase: PlantPhase
  phases: Array<PlantPhase>
  wateringSchema?: WateringSchema
  logs: PlantLogs
  images: Array<PlantImage>
  favoritImage?: PlantImage
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
  [INDEX_PLANT_IMAGE_ID]?: number
}

interface PlantImageRow {
  id: number
  plantId: number
  data: ArrayBuffer
  mime: string
  [INDEX_SORT]: number
}

interface PlantImageSort {
  [INDEX_PLANT_ID]: number
  images: Array<HasId<number>>
}

interface HasPlantId { [INDEX_PLANT_ID]: number }
type WithPlantId<T> = WithId<T, number> & HasPlantId

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
