import type { type INDEX_PLANT_ID, INDEX_SORT, type TABLE_FERTILIZERS, type TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, type TABLE_PLANT_IMAGES, type TABLE_PLANT_PHASES, type TABLE_PLANT_SUBSTRATES, type TABLE_PLANT_WATERING_LOGS, type TABLE_PLANTS, type TABLE_WATERING_SCHEMAS } from '../db'
import type { FertilizerRow, FertilizerWateringSchemaRow, WateringSchemaRow } from '../nutrients/types'
import type { PlantImageRow, PlantPhaseRow, PlantRow, PlantSubstrateRow, WateringLogRow } from '../plants/types'

interface ImportExportData {
  [TABLE_PLANTS]: Array<PlantRow>
  [TABLE_PLANT_IMAGES]: Array<PlantImageRow>
  [TABLE_PLANT_SUBSTRATES]: Array<PlantSubstrateRow>
  [TABLE_PLANT_PHASES]: Array<PlantPhaseRow>
  [TABLE_PLANT_WATERING_LOGS]: Array<WateringLogRow>
  [TABLE_FERTILIZERS]: Array<FertilizerRow>
  [TABLE_WATERING_SCHEMAS]: Array<WateringSchemaRow>
  [TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA]: Array<FertilizerWateringSchemaRow>
}

type BackupStoreNames = typeof TABLE_PLANTS
  | typeof TABLE_PLANT_IMAGES
  | typeof TABLE_PLANT_SUBSTRATES
  | typeof TABLE_PLANT_PHASES
  | typeof TABLE_PLANT_WATERING_LOGS
  | typeof TABLE_FERTILIZERS
  | typeof TABLE_WATERING_SCHEMAS
  | typeof TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA

type BackupTxStores = BackupStoreNames[]

interface CleanPlantPhaseData {
  phase: string
  startedAt: number
}

interface CleanPlantSubstrateData {
  substrate: string
  size: string
}

interface CleanWateringLogFertilizer {
  amount: number
  name: string
  manufacturer?: string
}

interface CleanPlantWateringLogData {
  date: number
  amount: number
  ph?: number
  ec?: number
  fertilizers: Array<CleanWateringLogFertilizer>
}

interface CleanPlantLogs {
  watering: Array<CleanPlantWateringLogData>
}

interface CleanFertilizerData {
  id: number
  name: string
  manufacturer?: string
  newId?: IDBValidKey
}
type CleanFertilizer = Omit<CleanFertilizerData, 'id'>

interface CleanWateringSchemaFertilizer {
  amount: number
  fertilizer: CleanFertilizerData
}
interface CleanWateringSchemaData {
  id: number
  name: string
  fertilizers: Array<CleanWateringSchemaFertilizer>
  createdAt: number
  updatedAt: number
  newId?: IDBValidKey
}
type CleanWateringSchema = Omit<CleanWateringSchemaData, 'id', 'fertilizers'>

interface CleanPlantImageData {
  data: ArrayBuffer
  mime: string
}

type CleanPlantImage = CleanPlantImageData & {
  [INDEX_PLANT_ID]: IDBValidKey
  [INDEX_SORT]: number
}

interface CleanPlantData {
  strain: string
  name?: string
  substrate: CleanPlantSubstrateData
  phases: Array<CleanPlantPhaseData>
  logs: CleanPlantLogs
  wateringSchema?: CleanWateringSchemaData
  images: Array<CleanPlantImageData>
}

type CleanPlant = Omit<CleanPlantData, 'wateringSchema' | 'substrate' | 'phases' | 'logs' | 'images'> & {
  wateringSchemaId?: IDBValidKey
}

type CleanPlantSubstrate = CleanPlantSubstrateData & { [INDEX_PLANT_ID]: IDBValidKey }

type CleanPlantPhase = CleanPlantPhaseData & { [INDEX_PLANT_ID]: IDBValidKey }

type CleanPlantWateringLog = CleanPlantWateringLogData & { [INDEX_PLANT_ID]: IDBValidKey }
