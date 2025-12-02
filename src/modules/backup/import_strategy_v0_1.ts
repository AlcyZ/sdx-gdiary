import type { AsyncResult } from '../../types'
import type ImportBackupError from './import_backup_error.ts'
import type { ImportStrategy } from './types'
import { ok } from '../../util.ts'

export default class ImportStrategyV01 implements ImportStrategy {
  public async importData(file: File): AsyncResult<void, ImportBackupError> {
    // eslint-disable-next-line no-console
    console.info('importing v0.1', file)
    return ok()
  }
}
