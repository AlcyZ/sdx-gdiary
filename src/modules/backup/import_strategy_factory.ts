import type { ImportStrategy, ImportVersion } from './types'
import ImportStrategyV01 from './import_strategy_v0_1.ts'
import ImportStrategyV02 from './import_strategy_v0_2.ts'

export default class ImportStrategyFactory {
  // private readonly db: IDBPDatabase

  // constructor(db: IDBPDatabase) {
  constructor() {
    // this.db = db
  }

  public static create(): ImportStrategyFactory {
    return new ImportStrategyFactory()
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
    return new ImportStrategyV01()
  }

  public createV02(): ImportStrategyV02 {
    return new ImportStrategyV02()
  }
}
