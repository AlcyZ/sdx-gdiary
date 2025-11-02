import type { Component } from 'vue'
import type { HasId, HasTimestamps, WithId } from '../../types'

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
}

type PlantSubstrate = WithId<NewPlantSubstrate, number>
type PlantPhase = WithId<NewPlantPhase, number>

type Plant = {
  strain: string
  name?: string
  substrate: PlantSubstrate
  phase: PlantPhase
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

interface PlantPhaseItem {
  phase: PlantPhaseType
  label: string
}

interface PlantRow {
  id: number
  strain: string
  name?: string
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
