import type { ParseJsonError } from '../../types'

interface ImportBackupErrorDescriptor {
  json?: ParseJsonError
  previous?: unknown
}

export default class ImportBackupError extends Error {
  private readonly json: ParseJsonError | undefined
  private readonly previous?: unknown

  constructor(message: string, {
    json = undefined,
    previous = undefined,
  }: ImportBackupErrorDescriptor) {
    super(message)
    this.json = json
    this.previous = previous
    Object.setPrototypeOf(this, ImportBackupError.prototype)
  }

  public static dataJsonNotFound(filename: string): ImportBackupError {
    return new ImportBackupError(`Invalid backup filename. File (${filename}) not found in zip package`, {})
  }

  public static invalidBackupData(error: ParseJsonError): ImportBackupError {
    return new ImportBackupError(`Invalid backup data in ZIP package`, {
      json: error,
    })
  }

  public static emptyDatabaseRequired(): ImportBackupError {
    return new ImportBackupError('Database/indexDB stores must be empty', {})
  }

  public static error(error: unknown): ImportBackupError {
    return new ImportBackupError('An error occurred while importing the backup', { previous: error })
  }

  public log() {
    const args: any[] = [this]

    if (this.previous)
      args.push(this.previous)

    if (this.json)
      args.push(this.json)

    console.error(...args)
  }
}
