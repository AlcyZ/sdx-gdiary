import type { AsyncResult } from '../../types'
import type BackupServiceUtil from './backup_service_util.ts'
import type ImportBackupError from './import_backup_error.ts'
import type { ImportVersion } from './types'
import {
  getDb,
} from '../db'
import BackupImporter from './backup_importer.ts'
import ImportStrategyFactory from './import_strategy_factory.ts'

export default class ImportRepository {
  private readonly importer: BackupImporter
  private readonly factory: ImportStrategyFactory

  constructor(
    importer: BackupImporter,
    factory: ImportStrategyFactory,
  ) {
    this.importer = importer
    this.factory = factory
  }

  public static async create(util: BackupServiceUtil): Promise<ImportRepository> {
    const db = await getDb()
    const factory = ImportStrategyFactory.create(db, util)

    const defaultStrategy = factory.createV02()
    const importer = BackupImporter.create(defaultStrategy)

    return new ImportRepository(importer, factory)
  }

  public async importBackup(file: File, version: ImportVersion): AsyncResult<void, ImportBackupError> {
    const strategy = this.factory.createFromVersion(version)
    this.importer.setStrategy(strategy)

    return this.importer.importBackup(file)
  }
}
