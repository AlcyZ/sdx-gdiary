import type { IDBPDatabase } from 'idb'

import type { AsyncResult, Result } from '../../types'
import type DeleteDatabaseError from '../db/delete_database_error.ts'
import type ExportBackupError from './export_backup_error.ts'
import type ImportBackupError from './import_backup_error.ts'
import { getDb, safeDeleteDatabase } from '../db'
import BackupServiceUtil from './backup_service_util.ts'
import ExportRepository from './export_repository.ts'
import ImportCleanRepository from './import_clean_repository.ts'
import ImportRepository from './import_repository.ts'

export default class BackupService {
  private readonly importRepo: ImportRepository
  private readonly importCleanRepo: ImportCleanRepository
  private readonly exportRepo: ExportRepository
  private readonly util: BackupServiceUtil
  private readonly db: IDBPDatabase

  constructor(
    importRepo: ImportRepository,
    importCleanRepo: ImportCleanRepository,
    exportRepo: ExportRepository,
    util: BackupServiceUtil,
    db: IDBPDatabase,
  ) {
    this.importRepo = importRepo
    this.importCleanRepo = importCleanRepo
    this.exportRepo = exportRepo
    this.util = util
    this.db = db
  }

  public static async create(): Promise<BackupService> {
    const util = new BackupServiceUtil()
    const [importRepo, importCleanRepo, exportRepo, db] = await Promise.all([
      ImportRepository.create(util),
      ImportCleanRepository.create(util),
      ExportRepository.create(util),
      getDb(),
    ])
    return new BackupService(importRepo, importCleanRepo, exportRepo, util, db)
  }

  public async createBackupZip(): AsyncResult<Blob, ExportBackupError> {
    return this.exportRepo.createBackupZip()
  }

  public async importBackup(file: File, clean: boolean = false): AsyncResult<void, ImportBackupError> {
    return clean
      ? this.importCleanRepo.importBackup(file)
      : this.importRepo.importBackup(file)
  }

  public isDbEmpty(): Promise<boolean> {
    return this.util.isDbEmpty(this.db)
  }

  public safeDeleteDatabase(): Promise<Result<undefined, DeleteDatabaseError>> {
    return safeDeleteDatabase()
  }
}
