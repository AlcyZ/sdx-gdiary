import { openDB } from 'idb'

const DB_NAME = 'GrowDiary'

export const TABLE_PLANTS = 'plants'
export const TABLE_PLANT_IMAGES = 'plantImages'

const DEFAULT_KEY_PATH = 'id'
const INDEX_PLANT_ID = 'plantId'
const TYPE_PNG = 'image/png'

export async function getDb() {
  return openDB(DB_NAME, 1, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(TABLE_PLANTS)) {
        db.createObjectStore(TABLE_PLANTS, {
          keyPath: DEFAULT_KEY_PATH,
          autoIncrement: true,
        })
      }
      if (!db.objectStoreNames.contains(TABLE_PLANT_IMAGES)) {
        const store = db.createObjectStore(TABLE_PLANT_IMAGES, {
          keyPath: DEFAULT_KEY_PATH,
          autoIncrement: true,
        })
        store.createIndex(INDEX_PLANT_ID, INDEX_PLANT_ID)
      }
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

export function isBase64String(base64: string, type = TYPE_PNG): boolean {
  const prefix = `data:${type};base64,`
  return base64.startsWith(prefix)
}
