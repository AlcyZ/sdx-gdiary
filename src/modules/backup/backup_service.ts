import type { AsyncResult } from '../../types'

import type ExportBackupError from './export_backup_error.ts'
import BackupServiceUtil from './backup_service_util.ts'
import ExportRepository from './export_repository.ts'
import ImportRepository from './import_repository.ts'

export default class BackupService {
  private readonly importRepo: ImportRepository
  private readonly exportRepo: ExportRepository

  constructor(importRepo: ImportRepository, exportRepo: ExportRepository) {
    this.importRepo = importRepo
    this.exportRepo = exportRepo
  }

  public static async create(): Promise<BackupService> {
    const util = new BackupServiceUtil()
    const [importRepo, exportRepo] = await Promise.all([
      ImportRepository.create(util),
      ExportRepository.create(util),
    ])
    return new BackupService(importRepo, exportRepo)
  }

  public async createBackupZip(): AsyncResult<Blob, ExportBackupError> {
    return this.exportRepo.createBackupZip()
  }

  public async importBackup(file: File): AsyncResult<void, unknown> {
    return this.importRepo.importBackup(file)
  }
}
