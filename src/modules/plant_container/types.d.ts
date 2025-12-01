import type { INDEX_PLANT_ID } from '../db'

type PlantContainerMedium = 'soil' | 'coco' | 'hydro' | 'rockwool' | 'custom'

interface PlantContainerRow {
  id: number
  [INDEX_PLANT_ID]: IDBValidKey
  date: number
  medium: PlantContainerMedium
  container: string
  volume: number
  notes?: string
}

type NewPlantContainerRow = Omit<PlantContainerRow, 'id'>
type PlantContainer = Omit<PlantContainerRow, typeof INDEX_PLANT_ID>
