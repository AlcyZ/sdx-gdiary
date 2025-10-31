import type { IDBPDatabase } from 'idb'
import type { Result } from '../../types'
import { err, ok } from '../../util.ts'
import { base64ToBlob, getDb, INDEX_PLANT_ID, isBase64String, TABLE_PLANT_IMAGES, TABLE_PLANTS } from '../db'

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

function validateNewPlant(plant: NewPlant): Result<undefined, SavePlantError> {
  const image = !isBase64String(plant.image) ? 'Es muss ein Bild für die Pflanze ausgewählt werden!' : undefined
  const strain = plant.strain === '' ? 'Es muss eine Sorte für die Pflanze ausgewählt werden!' : undefined
  const poppedAt = plant.strain === '' ? 'Es muss das Datum der Einpflanzung angegeben werden!' : undefined

  if (image !== undefined || strain !== undefined || poppedAt !== undefined) {
    return err({ image, strain, poppedAt })
  }

  return ok(undefined)
}

export async function savePlant(plant: NewPlant): Promise<Result<undefined, SavePlantError>> {
  const validationResult = validateNewPlant(plant)
  if (!validationResult.ok) {
    console.error('[plants/index.ts:savePlant] - Invalid plant data', plant, validationResult)
    return err(validationResult.error)
  }

  try {
    const db = await getDb()
    const tx = db.transaction([TABLE_PLANTS, TABLE_PLANT_IMAGES], 'readwrite')

    const plantStore = tx.objectStore(TABLE_PLANTS)
    const imageStore = tx.objectStore(TABLE_PLANT_IMAGES)

    const now = (): string => (new Date()).toISOString()
    const timestamps = { createdAt: now(), updatedAt: now() }

    const plantData = {
      strain: plant.strain,
      name: plant.name,
      poppedAt: plant.poppedAt,
      ...timestamps,
    }
    const plantId = await plantStore.add(plantData)

    const imageData = {
      plantId,
      image: base64ToBlob(plant.image),
    }

    await imageStore.add(imageData)
    await tx.done

    return ok(undefined)
  }
  catch (error) {
    console.error('[plants/index.ts:savePlant] - Failed to save plant', error, plant)
    return err({ unknown: 'Pflanze konnte aufgrund eines Fehlers nicht gespeichert werden!' })
  }
}

export async function deletePlant(plantId: number): Promise<Result<undefined, string>> {
  try {
    const db = await getDb()
    const tx = db.transaction([TABLE_PLANTS, TABLE_PLANT_IMAGES], 'readwrite')

    const plantsStore = tx.objectStore(TABLE_PLANTS)
    const plantsImageStore = tx.objectStore(TABLE_PLANT_IMAGES)

    const indexPlantId = plantsImageStore.index(INDEX_PLANT_ID)
    const imagesKeys = await indexPlantId.getAllKeys(plantId)

    for (const key of imagesKeys) {
      await plantsImageStore.delete(key)
    }
    await plantsStore.delete(plantId)

    await tx.done
    return ok(undefined)
  }
  catch (error) {
    console.error('[plants/index.ts:deletePlant] - Failed to delete plant', error, plantId)
    return err('Pflanze konnte aufgrund eines Fehlers nicht gelöscht werden!')
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
    const image = isPlantImageRow(imageRow) ? URL.createObjectURL(imageRow.image) : ''

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
      ? URL.createObjectURL(imageRow.image)
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
    && hasBlobKey(value, 'image')
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
