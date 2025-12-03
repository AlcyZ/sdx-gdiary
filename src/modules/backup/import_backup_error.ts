import type { ParseJsonError } from '../../types'

interface ImportBackupErrorDescriptor {
  json?: ParseJsonError
  previous?: unknown
}

export default class ImportBackupError extends Error {
  private readonly json: ParseJsonError | undefined
  private readonly previous?: unknown
  private readonly code: number

  private static readonly ERR_JSON_NOT_FOUND = 1
  private static readonly ERR_INVALID_BACKUP_DATA = 10
  private static readonly ERR_EMPTY_DATABASE_REQUIRED = 20
  private static readonly ERR_UNKNOWN = 100

  constructor(message: string, code: number, {
    json = undefined,
    previous = undefined,
  }: ImportBackupErrorDescriptor) {
    super(message)

    this.json = json
    this.previous = previous
    this.code = code

    Object.setPrototypeOf(this, ImportBackupError.prototype)
  }

  public static dataJsonNotFound(filename: string): ImportBackupError {
    return new ImportBackupError(
      `Invalid backup filename. File (${filename}) not found in zip package`,
      ImportBackupError.CODE_JSON_NOT_FOUND,
      {},
    )
  }

  public static invalidBackupData(error: ParseJsonError): ImportBackupError {
    return new ImportBackupError(
      `Invalid backup data in ZIP package`,
      ImportBackupError.CODE_INVALID_BACKUP_DATA,
      {
        json: error,
      },
    )
  }

  public static emptyDatabaseRequired(): ImportBackupError {
    return new ImportBackupError(
      'Database/indexDB stores must be empty',
      ImportBackupError.CODE_EMPTY_DATABASE_REQUIRED,
      {},
    )
  }

  public static error(error: unknown): ImportBackupError {
    return new ImportBackupError(
      'An error occurred while importing the backup',
      ImportBackupError.CODE_UNKNOWN,
      { previous: error },
    )
  }

  public log() {
    const args: any[] = [this]

    if (this.previous)
      args.push(this.previous)

    if (this.json)
      args.push(this.json)

    console.error(...args)
  }

  public static get CODE_JSON_NOT_FOUND(): number {
    return ImportBackupError.ERR_JSON_NOT_FOUND
  }

  public static get CODE_INVALID_BACKUP_DATA(): number {
    return ImportBackupError.ERR_INVALID_BACKUP_DATA
  }

  public static get CODE_EMPTY_DATABASE_REQUIRED(): number {
    return ImportBackupError.ERR_EMPTY_DATABASE_REQUIRED
  }

  public static get CODE_UNKNOWN(): number {
    return ImportBackupError.ERR_UNKNOWN
  }

  public isCode(code: number): boolean {
    return this.code === code
  }
}
