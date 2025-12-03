import type { IDBPDatabase } from 'idb'
import type BackupServiceUtil from './backup_service_util.ts'
import type { ImportDataV01, ImportExportData, ImportStrategy, ImportVersion } from './types'
import ImportStrategyHelper from './import_strategy_helper.ts'
import ImportStrategyV01 from './import_strategy_v0_1.ts'
import ImportStrategyV02 from './import_strategy_v0_2.ts'

export default class ImportStrategyFactory {
  private readonly db: IDBPDatabase
  private readonly util: BackupServiceUtil

  constructor(db: IDBPDatabase, util: BackupServiceUtil) {
    this.db = db
    this.util = util
  }

  public static create(db: IDBPDatabase, util: BackupServiceUtil): ImportStrategyFactory {
    return new ImportStrategyFactory(db, util)
  }

  public createFromVersion(version: ImportVersion): ImportStrategy {
    switch (version) {
      case '0.1':
        return this.createV01()
      case '0.2':
      default:
        return this.createV02()
    }
  }

  public createV01(): ImportStrategyV01 {
    const helper = ImportStrategyHelper.create<ImportDataV01>(this.util)
    return ImportStrategyV01.create(helper, this.db, this.util)
  }

  public createV02(): ImportStrategyV02 {
    const helper = ImportStrategyHelper.create<ImportExportData>(this.util)
    return ImportStrategyV02.create(helper, this.db, this.util)
  }
}
