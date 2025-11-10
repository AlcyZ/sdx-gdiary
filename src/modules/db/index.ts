import type { IDBPDatabase } from 'idb'
import { openDB } from 'idb'
import { none, some } from '../../util.ts'

const DB_NAME = 'GrowDiary'

export const TABLE_PLANTS = 'plants' as const
export const TABLE_PLANT_IMAGES = 'plantImages' as const
export const TABLE_PLANT_SUBSTRATES = 'plantSubstrates' as const
export const TABLE_PLANT_PHASES = 'plantPhases' as const
export const TABLE_PLANT_WATERING_LOGS = 'plantWateringLogs' as const
export const TABLE_FERTILIZERS = 'fertilizers' as const
export const TABLE_WATERING_SCHEMAS = 'wateringSchema' as const
export const TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA = 'fertilizerWateringSchema' as const
export const TABLES_DB = [
  TABLE_PLANTS,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_SUBSTRATES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_FERTILIZERS,
  TABLE_WATERING_SCHEMAS,
  TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
] as const

export const INDEX_PLANT_ID = 'plantId' as const
export const INDEX_FERTILIZER_ID = 'fertilizerId' as const
export const INDEX_WATERING_SCHEMA_ID = 'wateringSchemaId' as const

const DEFAULT_KEY_PATH = 'id'
const TYPE_PNG = 'image/png'

function createTable(
  table: string,
  db: IDBPDatabase,
) {
  if (!db.objectStoreNames.contains(table)) {
    return some(db.createObjectStore(table, {
      keyPath: DEFAULT_KEY_PATH,
      autoIncrement: true,
    }))
  }

  return none()
}

function createTableWithIndices(
  table: string,
  indices: Array<string>,
  db: IDBPDatabase,
) {
  const opt = createTable(table, db)

  if (opt.exist) {
    indices.forEach(index => opt.value.createIndex(index, index, { unique: false }))
  }
}

let dbInstance: IDBPDatabase | null = null

export async function getDb() {
  if (dbInstance !== null)
    return dbInstance

  const createPlantSubTable = (table: string, db: IDBPDatabase) =>
    createTableWithIndices(table, [INDEX_PLANT_ID], db)

  dbInstance = await openDB(DB_NAME, 1, {
    upgrade(db) {
      createTableWithIndices(TABLE_PLANTS, [INDEX_WATERING_SCHEMA_ID], db)

      createPlantSubTable(TABLE_PLANT_IMAGES, db)
      createPlantSubTable(TABLE_PLANT_SUBSTRATES, db)
      createPlantSubTable(TABLE_PLANT_PHASES, db)
      createPlantSubTable(TABLE_PLANT_WATERING_LOGS, db)

      createTable(TABLE_FERTILIZERS, db)
      createTable(TABLE_WATERING_SCHEMAS, db)
      createTableWithIndices(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, [INDEX_FERTILIZER_ID, INDEX_WATERING_SCHEMA_ID], db)
    },
  })

  return dbInstance
}

export function base64ToBlob(base64: string, type = TYPE_PNG): Blob {
  const dataStr = base64.split(',')[1] || ''
  const byteString = atob(dataStr)

  const buffer = new ArrayBuffer(byteString.length)
  const data = new Uint8Array(buffer)
  for (let i = 0; i < byteString.length; i++) {
    data[i] = byteString.charCodeAt(i)
  }
  return new Blob([buffer], { type })
}

export function isBase64String(base64: string): boolean {
  const pattern = /^data:image\/(?:png|jpeg|jpg|webp|gif|svg\+xml);base64,/
  return pattern.test(base64)
}
