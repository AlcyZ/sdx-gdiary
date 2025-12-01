import type { INDEX_PLANT_ID } from '../db'

type PlantContainerMedium = 'Erde' | 'Coco' | 'Hydro' | 'Steinwolle' | 'Custom'

interface PlantContainerRow {
  id: number
  [INDEX_PLANT_ID]: number
  date: number
  medium_type: PlantContainerMedium
  container_type: string
  volume_liters: number
  notes?: string
}

type PlantContainer = Omit<PlantContainerRow, typeof INDEX_PLANT_ID>
