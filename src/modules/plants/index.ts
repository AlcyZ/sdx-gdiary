import type { IDBPDatabase } from 'idb'
import type { Result } from '../../types'
import { err, ok } from '../../util.ts'
import { getDb, INDEX_PLANT_ID, TABLE_PLANT_IMAGES, TABLE_PLANTS } from '../db'

const THRESHOLD_IMAGE_ROWS: number = 30

export async function fetchPlants(): Promise<Result<Array<Plant>, string>> {
  try {
    const db = await getDb()

    const plantsData = await db.getAll(TABLE_PLANTS)
    const plantRows = plantsData.filter((row: any): boolean => isPlantRow(row))

    const plants = await mapPlants(plantRows, db)
    return ok(plants)
  }
  catch (error) {
    console.error('[plants/index.ts:fetchPlants] - Failed to fetch Plants', error)

    return err('Pflanzen konnten aufgrund eines Fehlers nicht geladen werden!')
  }
}

async function mapPlants(rows: Array<PlantRow>, db: IDBPDatabase): Promise<Array<Plant>> {
  return rows.length < THRESHOLD_IMAGE_ROWS
    ? mapOneByOne(rows, db)
    : mapSimultaneously(rows, db)
}

async function mapOneByOne(rows: Array<PlantRow>, db: IDBPDatabase): Promise<Array<Plant>> {
  const mapToPlant = async (row: PlantRow, db: IDBPDatabase) => {
    const tx = db.transaction(TABLE_PLANT_IMAGES)
    const store = tx.objectStore(TABLE_PLANT_IMAGES)
    const index = store.index(INDEX_PLANT_ID)

    const imageRow = await index.get(row.id)
    const image = isPlantImageRow(imageRow) ? URL.createObjectURL(imageRow.blob) : ''

    return {
      ...row,
      image,
    }
  }

  return await Promise.all(
    rows.map(async (row: PlantRow): Promise<Plant> => await mapToPlant(row, db)),
  )
}

async function mapSimultaneously(rows: Array<PlantRow>, db: IDBPDatabase): Promise<Array<Plant>> {
  const tx = db.transaction(TABLE_PLANT_IMAGES)
  const store = tx.objectStore(TABLE_PLANT_IMAGES)
  const imageRows = (await store.getAll()).filter(isPlantImageRow) as Array<PlantImageRow>

  const getPlantImage = (plantRow: PlantRow): string => {
    const imageRow = imageRows.find(imageRow => imageRow.plantId === plantRow.id)
    return imageRow !== undefined
      ? URL.createObjectURL(imageRow.blob)
      : ''
  }

  return rows.map((plantRow: PlantRow): Plant => ({
    ...plantRow,
    image: getPlantImage(plantRow),
  }))
}

function isPlantRow(value: any): value is PlantRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasStrKey(value, 'name')
    && hasStrKey(value, 'strain')
    && hasStrKey(value, 'poppedAt')
    && hasTimestamps(value)
}

function isPlantImageRow(value: any): value is PlantImageRow {
  return typeof value === 'object'
    && hasNumKey(value, 'id')
    && hasNumKey(value, 'plantId')
    && hasBlobKey(value, 'blob')
}

function hasTimestamps(value: any): boolean {
  return hasStrKey(value, 'createdAt')
    && hasStrKey(value, 'updatedAt')
}

function hasStrKey(value: Record<string, unknown>, key: string): boolean {
  return key in value && typeof value[key] === 'string'
}

function hasNumKey(value: Record<string, unknown>, key: string): boolean {
  return key in value && typeof value[key] === 'number'
}

function hasBlobKey(value: Record<string, unknown>, key: string): boolean {
  return key in value && value[key] instanceof Blob
}
