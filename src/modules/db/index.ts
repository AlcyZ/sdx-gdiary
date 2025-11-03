import type { IDBPDatabase } from 'idb'
import { openDB } from 'idb'
import { none, some } from '../../util.ts'

const DB_NAME = 'GrowDiary'

export const TABLE_PLANTS = 'plants'
export const TABLE_PLANT_IMAGES = 'plantImages'
export const TABLE_PLANT_SUBSTRATES = 'plantSubstrates'
export const TABLE_PLANT_PHASES = 'plantPhases'
export const TABLE_FERTILIZERS = 'fertilizers'
export const TABLE_SCHEMAS = 'schemas'
export const TABLE_PIVOT_FERTILIZER_SCHEMA = 'fertilizerSchema'

export const INDEX_PLANT_ID = 'plantId'
export const INDEX_FERTILIZER_ID = 'fertilizerId'
export const INDEX_SCHEMA_ID = 'schemaId'

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

export async function getDb() {
  const createPlantSubTable = (table: string, db: IDBPDatabase) =>
    createTableWithIndices(table, [INDEX_PLANT_ID], db)

  return openDB(DB_NAME, 1, {
    upgrade(db) {
      createTable(TABLE_PLANTS, db)

      createPlantSubTable(TABLE_PLANT_IMAGES, db)
      createPlantSubTable(TABLE_PLANT_SUBSTRATES, db)
      createPlantSubTable(TABLE_PLANT_PHASES, db)

      createTable(TABLE_FERTILIZERS, db)
      createTable(TABLE_SCHEMAS, db)
      createTableWithIndices(TABLE_PIVOT_FERTILIZER_SCHEMA, [INDEX_FERTILIZER_ID, INDEX_SCHEMA_ID], db)
    },
  })
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
