import type { AsyncResult } from '../../types'
import type ImportBackupError from './import_backup_error.ts'
import type { ImportStrategy } from './types'

export default class BackupImporter {
  private strategy: ImportStrategy

  constructor(strategy: ImportStrategy) {
    this.strategy = strategy
  }

  public static create(strategy: ImportStrategy): BackupImporter {
    return new BackupImporter(strategy)
  }

  public setStrategy(strategy: ImportStrategy): void {
    this.strategy = strategy
  }

  public async importBackup(file: File): AsyncResult<void, ImportBackupError> {
    return this.strategy.importData(file)
  }
}
