interface NewPlantSubstrate {
  substrate: PlantSubstrate
  size: string
  info?: string
}

interface NewPlantPhase {
  phase: PlantPhase
  startedAt: string
  info?: string
}

interface NewPlant {
  strain: string
  name?: string
  substrate: NewPlantSubstrate
  phase: NewPlantPhase
}

type PlantSubstrate = 'Erde' | 'Coco' | 'Hydro' | 'Custom'
type PlantPhase = 'germination'
  | 'seedling'
  | 'vegetation'
  | 'pre-flower'
  | 'flower'
  | 'ripening'
  | 'harvest'
  | 'drying'
  | 'curing'

interface PlantPhaseItem {
  phase: PlantPhase
  label: string
}
