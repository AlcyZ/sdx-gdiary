import type { IDBPDatabase, IDBPObjectStore } from 'idb'
import type BackupServiceUtil from './backup_service_util.ts'
import type { BackupStoreNames, BackupTxStores, ImportExportData } from './types'
import JSZip from 'jszip'
import { safeAsync, safeParseJson, some, wrapOption } from '../../util.ts'
import {
  getDb,
  TABLE_FERTILIZERS,
  TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_SUBSTRATES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS,
  TABLE_WATERING_SCHEMAS,
  TABLES_DB,
} from '../db'
import { BACKUP_FILENAME_DATA, BACKUP_FILENAME_IMAGE } from './constants.ts'
import { isImportExportData } from './guard.ts'
import ImportBackupError from './import_backup_error.ts'

export default class ImportRepository {
  private readonly db: IDBPDatabase
  private readonly util: BackupServiceUtil

  constructor(db: IDBPDatabase, util: BackupServiceUtil) {
    this.db = db
    this.util = util
  }

  public static async create(util: BackupServiceUtil): Promise<ImportRepository> {
    const db = await getDb()
    return new ImportRepository(db, util)
  }

  public async importBackup(file: File) {
    return safeAsync(async () => {
      const zip = await JSZip.loadAsync(file)

      const json = zip.file(BACKUP_FILENAME_DATA)
      if (!json)
        throw new ImportBackupError(`Invalid ZIP package: backup file ${BACKUP_FILENAME_DATA} not found`)

      const content = await json.async('text')

      const result = safeParseJson(content, isImportExportData)
      if (!result.ok)
        throw new ImportBackupError(`Invalid ZIP package: invalid backup data`, result.error)

      await this.importData(result.value, zip)
    })
  }

  private async importData(data: ImportExportData, zip: JSZip) {
    await Promise.all([
      this.loadImages(data, zip),
      this.truncateStores(),
    ])

    const tx = this.db.transaction(TABLES_DB, 'readwrite')
    const {
      storePlants,
      storePlantImages,
      storePlantSubstrates,
      storePlantPhases,
      storePlantWateringLogs,
      storeFertilizers,
      storeWateringSchema,
      storeFertilizerWateringSchema,
    } = this.util.unpackStores(tx)

    await Promise.all([
      this.addData(TABLE_PLANTS, storePlants, data),
      this.addData(TABLE_PLANT_IMAGES, storePlantImages, data),
      this.addData(TABLE_PLANT_SUBSTRATES, storePlantSubstrates, data),
      this.addData(TABLE_PLANT_PHASES, storePlantPhases, data),
      this.addData(TABLE_PLANT_WATERING_LOGS, storePlantWateringLogs, data),
      this.addData(TABLE_FERTILIZERS, storeFertilizers, data),
      this.addData(TABLE_WATERING_SCHEMAS, storeWateringSchema, data),
      this.addData(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA, storeFertilizerWateringSchema, data),
    ])
    await tx.done
  }

  private async loadImages(data: ImportExportData, zip: JSZip) {
    const files = Object.values(zip.files).filter(f => !f.dir)
    const findById = (id: number) => wrapOption(files.find(file => file.name.startsWith(`${BACKUP_FILENAME_IMAGE}${id}`)))
    const loadById = async (id: number) => {
      const option = findById(id)
      if (!option.exist)
        return option

      const file = await option.value.async('blob')
      return some(file)
      //
      // const ext = unwrapOr(getExtension(option.value.name), '')
      // const mime = mapExtensionToMime(`.${ext}`)
      //
      // return some(new Blob([file], { type: mime }))
    }

    for (const image of data[TABLE_PLANT_IMAGES]) {
      const option = await loadById(image.id)

      if (option.exist) {
        image.image = option.value
      }
    }
  }

  private async addData<S extends BackupStoreNames>(
    table: S,
    store: IDBPObjectStore<
      unknown,
      BackupTxStores,
      S,
      'readwrite'
    >,
    data: ImportExportData,
  ) {
    data[table].forEach(row => store.add(row))
  }

  private async truncateStores() {
    const tx = this.db.transaction(TABLES_DB, 'readwrite')
    const promises: Array<Promise<void>> = []

    for (const storeName of TABLES_DB)
      promises.push(tx.objectStore(storeName).clear())

    await Promise.all(promises)
    await tx.done
  }
}
