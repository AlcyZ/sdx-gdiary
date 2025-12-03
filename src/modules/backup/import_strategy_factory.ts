import type { IDBPDatabase } from 'idb'
import type BackupServiceUtil from './backup_service_util.ts'
import type { ImportStrategy, ImportVersion } from './types'
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
    return ImportStrategyV01.create(this.db, this.util)
  }

  public createV02(): ImportStrategyV02 {
    return new ImportStrategyV02()
  }
}
