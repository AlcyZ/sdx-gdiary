export default class DeleteDatabaseError extends Error {
  private readonly error: unknown | undefined
  private readonly code: number

  private static readonly ERR_BLOCKED = 1
  private static readonly ERR_UNKNOWN = 2

  constructor(message: string, code: number, error?: unknown) {
    super(message)
    this.code = code
    this.error = error

    Object.setPrototypeOf(this, DeleteDatabaseError.prototype)
  }

  public static blocked(): DeleteDatabaseError {
    return new DeleteDatabaseError(
      'Failed to delete database, because IndexDB was blocked!',
      DeleteDatabaseError.ERR_BLOCKED,
    )
  }

  public static error(error: unknown): DeleteDatabaseError {
    return new DeleteDatabaseError(
      'Failed to delete database due to an error.',
      DeleteDatabaseError.ERR_UNKNOWN,
      error,
    )
  }

  public static get CODE_BLOCKED(): number {
    return DeleteDatabaseError.ERR_BLOCKED
  }

  public static get CODE_UNKNOWN(): number {
    return DeleteDatabaseError.ERR_UNKNOWN
  }

  public log() {
    const args: any[] = [this]

    if (this.error) {
      args.push(this.error)
    }

    console.error(...args)
  }

  public isCode(code: number): boolean {
    return this.code === code
  }
}
