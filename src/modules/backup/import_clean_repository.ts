import type { IDBPDatabase, IDBPObjectStore } from 'idb'
import type { AsyncResult } from '../../types'
import type { TABLE_FERTILIZERS, TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, TABLE_PLANT_IMAGES, TABLE_PLANT_PHASES, TABLE_PLANT_SUBSTRATES, TABLE_PLANT_WATERING_LOGS, TABLE_PLANTS, TABLE_WATERING_SCHEMAS } from '../db'
import type { PlantPhaseType, PlantRow } from '../plants/types'
import type BackupServiceUtil from './backup_service_util.ts'
import type {
  BackupTxStores,
  CleanFertilizer,
  CleanFertilizerData,
  CleanPlant,
  CleanPlantData,
  CleanPlantImage,
  CleanPlantImageData,
  CleanPlantPhase,
  CleanPlantSubstrate,
  CleanPlantWateringLog,
  CleanWateringSchema,
  CleanWateringSchemaData,
  CleanWateringSchemaFertilizer,
  ImportExportData,
} from './types'
import JSZip from 'jszip'
import { omitKeys, safeAsync, safeParseJson } from '../../util.ts'
import {
  getDb,
  INDEX_FERTILIZER_ID,
  INDEX_PLANT_ID,
  INDEX_WATERING_SCHEMA_ID,
  TABLES_DB,
} from '../db'
import { sortPlantPhases } from '../plants/helper.ts'
import { BACKUP_FILENAME_DATA } from './constants.ts'
import { isImportExportData } from './guard.ts'
import ImportBackupError from './import_backup_error.ts'

export default class ImportCleanRepository {
  private readonly db: IDBPDatabase
  private readonly util: BackupServiceUtil

  constructor(db: IDBPDatabase, util: BackupServiceUtil) {
    this.db = db
    this.util = util
  }

  public static async create(util: BackupServiceUtil): Promise<ImportCleanRepository> {
    const db = await getDb()

    return new ImportCleanRepository(db, util)
  }

  public async importBackup(file: File): AsyncResult<void, ImportBackupError> {
    return safeAsync(async () => {
      if (!await this.util.isDbEmpty(this.db))
        throw ImportBackupError.emptyDatabaseRequired()

      const zip = await JSZip.loadAsync(file)
      const json = zip.file(BACKUP_FILENAME_DATA)

      if (!json)
        throw ImportBackupError.dataJsonNotFound(BACKUP_FILENAME_DATA)

      const content = await json.async('text')
      const data = safeParseJson(content, isImportExportData)

      if (!data.ok)
        throw ImportBackupError.invalidBackupData(data.error)

      const fertilizersData = this.convertFertilizers(data.value)
      const schemasData = this.convertSchemas(data.value, fertilizersData)
      const plantsData = await this.convertPlants(data.value, schemasData, zip)

      await this.importData(plantsData, fertilizersData, schemasData)
    })
  }

  private async importData(plants: Array<CleanPlantData>, fertilizers: Array<CleanFertilizerData>, schemas: Array<CleanWateringSchemaData>) {
    const tx = this.db.transaction(TABLES_DB, 'readwrite')
    const {
      storePlants,
      storePlantSubstrates,
      storePlantPhases,
      storePlantWateringLogs,
      storePlantImages,
      storeFertilizers,
      storeWateringSchema,
      storeFertilizerWateringSchema,
    } = this.util.unpackStores(tx)

    await this.importFertilizers(fertilizers, storeFertilizers)
    await this.importSchemas(schemas, storeWateringSchema, storeFertilizerWateringSchema)
    await this.importPlants(plants, storePlants, storePlantSubstrates, storePlantPhases, storePlantWateringLogs, storePlantImages)

    await tx.done
  }

  private async importFertilizers(
    fertilizers: Array<CleanFertilizerData>,
    storeFertilizers: IDBPObjectStore<unknown, BackupTxStores, typeof TABLE_FERTILIZERS, 'readwrite'>,
  ) {
    for (const [i, fertilizer] of fertilizers.entries()) {
      if (fertilizers[i] === undefined)
        continue

      const data = this.convertData(fertilizer)
      fertilizers[i].newId = await storeFertilizers.add(data)
    }
  }

  private async importSchemas(
    schemas: Array<CleanWateringSchemaData>,
    storeWateringSchema: IDBPObjectStore<unknown, BackupTxStores, typeof TABLE_WATERING_SCHEMAS, 'readwrite'>,
    storeFertilizerWateringSchema: IDBPObjectStore<unknown, BackupTxStores, typeof TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, 'readwrite'>,
  ) {
    for (const [i, schema] of schemas.entries()) {
      if (schemas[i] === undefined)
        continue

      const data = this.convertData(schema)
      const schemaId = await storeWateringSchema.add(data)

      schemas[i].newId = schemaId
      const promises = schema.fertilizers.map(item => ({
        amount: item.amount,
        [INDEX_FERTILIZER_ID]: item.fertilizer.newId,
        [INDEX_WATERING_SCHEMA_ID]: schemaId,
      })).map(async data => await storeFertilizerWateringSchema.add(data))

      await Promise.all(promises)
    }
  }

  private async importPlants(
    plants: Array<CleanPlantData>,
    storePlants: IDBPObjectStore<unknown, BackupTxStores, typeof TABLE_PLANTS, 'readwrite'>,
    storePlantSubstrates: IDBPObjectStore<unknown, BackupTxStores, typeof TABLE_PLANT_SUBSTRATES, 'readwrite'>,
    storePlantPhases: IDBPObjectStore<unknown, BackupTxStores, typeof TABLE_PLANT_PHASES, 'readwrite'>,
    storePlantWateringLogs: IDBPObjectStore<unknown, BackupTxStores, typeof TABLE_PLANT_WATERING_LOGS, 'readwrite'>,
    storePlantImages: IDBPObjectStore<unknown, BackupTxStores, typeof TABLE_PLANT_IMAGES, 'readwrite'>,
  ) {
    for (const [i, plant] of plants.entries()) {
      if (plants[i] === undefined)
        continue

      const promises = []
      const plantData = this.convertPlantData(plant)

      const plantId = await storePlants.add(plantData)

      const substrateData = this.convertPlantSubstrate(plant, plantId)
      promises.push(storePlantSubstrates.add(substrateData))

      promises.push(
        ...this.convertPlantPhases(plant, plantId)
          .map(async data => await storePlantPhases.add(data)),
      )

      promises.push(
        ...this.convertPlantWateringLogs(plant, plantId)
          .map(async data => await storePlantWateringLogs.add(data)),
      )

      promises.push(
        ...this.convertPlantImage(plant, plantId)
          .map(async data => await storePlantImages.add(data)),
      )

      await Promise.all(promises)
    }
  }

  private convertSchemas(data: ImportExportData, fertilizers: Array<CleanFertilizerData>): Array<CleanWateringSchemaData> {
    return data.wateringSchema.map((schema): CleanWateringSchemaData => ({
      id: schema.id,
      name: schema.name,
      fertilizers: data.fertilizerWateringSchema.map((row): CleanWateringSchemaFertilizer | undefined => {
        const schemaFertilizers = fertilizers.find(fertilizer => fertilizer.id === row.fertilizerId)
        return schemaFertilizers !== undefined ? { amount: row.amount, fertilizer: schemaFertilizers } : undefined
      }).filter(item => item !== undefined),
      createdAt: schema.createdAt,
      updatedAt: schema.updatedAt,
    }))
  }

  private convertFertilizers(data: ImportExportData): Array<CleanFertilizerData> {
    return data.fertilizers.map((fertilizer): CleanFertilizerData => ({
      id: fertilizer.id,
      name: fertilizer.name,
      manufacturer: fertilizer.manufacturer,
    }))
  }

  private async convertPlants(data: ImportExportData, schemas: Array<CleanWateringSchemaData>, zip: JSZip): Promise<Array<CleanPlantData>> {
    return await Promise.all(data.plants.map(async (plant): Promise<CleanPlantData> => ({
      strain: plant.strain,
      name: plant.name,
      phases: data.plantPhases.filter(phase => phase.plantId === plant.id)
        .toSorted((lhs, rhs) => sortPlantPhases(lhs.phase, rhs.phase)),
      substrate: data.plantSubstrates.find(substrate => substrate.plantId === plant.id)!,
      logs: {
        watering: data.plantWateringLogs.filter(log => log.plantId === plant.id)
          .toSorted((lhs, rhs) => lhs.date - rhs.date)
          .map(log => ({
            date: log.date,
            amount: log.amount,
            ph: log.ph,
            ec: log.ec,
            fertilizers: log.fertilizers.map(fertilizer => ({
              amount: fertilizer.amount,
              name: fertilizer.name,
              manufacturer: fertilizer.manufacturer,
            })),
          })),
      },
      wateringSchema: schemas.find(schema => schema.id === plant.wateringSchemaId),
      images: await this.convertImages(data, plant, zip),
    })))
  }

  private async convertImages(data: ImportExportData, plant: PlantRow, zip: JSZip): Promise<Array<CleanPlantImageData>> {
    const loadById = this.util.loadImageByIdCallback(zip)

    const images = await Promise.all(
      data.plantImages.filter(row => row.plantId === plant.id)
        .map(async row => await loadById(row.id)),
    )

    return images.map(option => option.exist ? option.value : undefined)
      .filter(item => item !== undefined)
  }

  private convertData(data: CleanFertilizerData): CleanFertilizer
  private convertData(data: CleanWateringSchemaData): CleanWateringSchemaData
  private convertData(
    data: CleanFertilizerData | CleanWateringSchemaData,
  ): CleanFertilizer | CleanWateringSchema {
    const isSchema = (v: CleanFertilizerData | CleanWateringSchemaData): v is CleanWateringSchemaData => 'fertilizers' in v

    return isSchema(data) ? omitKeys(data, ['id', 'fertilizers']) : omitKeys(data, ['id'])
  }

  private convertPlantData(data: CleanPlantData): CleanPlant {
    const plant: CleanPlant = {
      strain: data.strain,
      name: data.name,
    }
    if (data.wateringSchema?.newId)
      plant.wateringSchemaId = data.wateringSchema.newId

    return plant
  }

  private convertPlantImage(data: CleanPlantData, plantId: IDBValidKey): Array<CleanPlantImage> {
    return data.images.map(item => ({
      plantId,
      data: item.data,
      mime: item.mime,
    }))
  }

  private convertPlantSubstrate(data: CleanPlantData, plantId: IDBValidKey): CleanPlantSubstrate {
    return {
      substrate: data.substrate.substrate,
      size: data.substrate.size,
      [INDEX_PLANT_ID]: plantId,
    }
  }

  private convertPlantPhases(data: CleanPlantData, plantId: IDBValidKey): Array<CleanPlantPhase> {
    return data.phases.toSorted((lhs, rhs) => sortPlantPhases(lhs.phase as PlantPhaseType, rhs.phase as PlantPhaseType))
      .map((phase): CleanPlantPhase => ({
        phase: phase.phase,
        startedAt: phase.startedAt,
        [INDEX_PLANT_ID]: plantId,
      }))
  }

  private convertPlantWateringLogs(data: CleanPlantData, plantId: IDBValidKey): Array<CleanPlantWateringLog> {
    return data.logs.watering.map(item => ({
      ...item,
      [INDEX_PLANT_ID]: plantId,
    }))
  }
}
