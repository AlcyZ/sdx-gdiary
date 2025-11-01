import type { IDBPDatabase } from 'idb'
import { openDB } from 'idb'

const DB_NAME = 'GrowDiary'

export const TABLE_PLANTS = 'plants'
export const TABLE_PLANT_IMAGES = 'plantImages'
export const TABLE_PLANT_SUBSTRATES = 'plantSubstrates'
export const TABLE_PLANT_PHASES = 'plantPhases'
export const INDEX_PLANT_ID = 'plantId'

const DEFAULT_KEY_PATH = 'id'
const TYPE_PNG = 'image/png'

function createTable(
  table: string,
  db: IDBPDatabase,
) {
  if (!db.objectStoreNames.contains(table)) {
    db.createObjectStore(table, {
      keyPath: DEFAULT_KEY_PATH,
      autoIncrement: true,
    })
  }
}

function createPlantSubTable(
  table: string,
  db: IDBPDatabase,
) {
  if (!db.objectStoreNames.contains(table)) {
    const store = db.createObjectStore(table, {
      keyPath: DEFAULT_KEY_PATH,
      autoIncrement: true,
    })
    store.createIndex(INDEX_PLANT_ID, INDEX_PLANT_ID, { unique: false })
  }
}

export async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      createTable(TABLE_PLANTS, db)

      createPlantSubTable(TABLE_PLANT_IMAGES, db)
      createPlantSubTable(TABLE_PLANT_SUBSTRATES, db)
      createPlantSubTable(TABLE_PLANT_PHASES, db)
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
