import type { InjectionKey } from 'vue'
import type BackupService from './modules/backup/backup_service.ts'
import type HarvestRepository from './modules/harvest/harvest_repository.ts'
import type FertilizerRepository from './modules/nutrients/fertilizer_repository.ts'
import type WateringSchemaRepository from './modules/nutrients/watering_schema_repository.ts'
import type PlantRepository from './modules/plants/plant_repository.ts'

export const REPO_PLANT = Symbol('PlantRepository') as InjectionKey<PlantRepository>
export const REPO_FERTILIZERS = Symbol('FertilizerRepository') as InjectionKey<FertilizerRepository>
export const REPO_WATERING_SCHEMA = Symbol('WateringSchemaRepository') as InjectionKey<WateringSchemaRepository>
export const REPO_HARVEST = Symbol('HarvestRepository') as InjectionKey<HarvestRepository>

export const SERVICE_BACKUP = Symbol('BackupService') as InjectionKey<BackupService>
