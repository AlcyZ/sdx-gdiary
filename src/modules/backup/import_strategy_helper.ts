import type { IDBPObjectStore } from 'idb'
import type JSZip from 'jszip'
import type { AsyncResult } from '../../types'
import type BackupServiceUtil from './backup_service_util.ts'
import type { BackupStoreNames, BackupTxStores, WithPlantImageRows } from './types'
import { err, ok, safeParseJson } from '../../util.ts'
import { INDEX_PLANT_ID, INDEX_SORT, TABLE_PLANT_IMAGES } from '../db'
import { BACKUP_FILENAME_DATA } from './constants.ts'
import ImportBackupError from './import_backup_error.ts'

export default class ImportStrategyHelper<
  T extends WithPlantImageRows,
> {
  private readonly util: BackupServiceUtil

  constructor(util: BackupServiceUtil) {
    this.util = util
  }

  public static create<T extends WithPlantImageRows>(util: BackupServiceUtil): ImportStrategyHelper<T> {
    return new ImportStrategyHelper(util)
  }

  public async tryLoadData(
    zip: JSZip,
    typeGuard: (value: any) => value is T,
  ): AsyncResult<T, ImportBackupError> {
    const json = zip.file(BACKUP_FILENAME_DATA)
    if (!json)
      return err(ImportBackupError.dataJsonNotFound(BACKUP_FILENAME_DATA))

    const content = await json.async('text')

    const result = safeParseJson(content, typeGuard)
    if (!result.ok)
      return err(ImportBackupError.invalidBackupData(result.error))

    return ok(result.value)
  }

  public async loadImages(data: T, zip: JSZip) {
    const loadById = this.util.loadImageByIdCallback(zip)

    for (const [i, plantImage] of data[TABLE_PLANT_IMAGES].entries()) {
      const option = await loadById(plantImage.id)

      if (option.exist) {
        data[TABLE_PLANT_IMAGES][i] = {
          [INDEX_PLANT_ID]: plantImage.plantId,
          id: plantImage.id,
          ...option.value,
          [INDEX_SORT]: i + 1,
        }
      }
    }
  }

  public async addData<S extends BackupStoreNames & keyof T>(
    table: S,
    store: IDBPObjectStore<
      unknown,
      BackupTxStores,
      S,
      'readwrite'
    >,
    data: T & Record<S, Array<any>>,
  ) {
    await Promise.all(data[table].map(row => store.add(row)))
  }
}
