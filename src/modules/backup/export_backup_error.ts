interface ExportBackupErrorDescriptor {
  data?: any
  previous?: unknown
}

export default class ExportBackupError extends Error {
  private readonly data: any
  private readonly previous: unknown

  constructor(
    message: string,
    {
      data = undefined,
      previous = undefined,
    }: ExportBackupErrorDescriptor,
  ) {
    super(message)
    this.data = data
    this.previous = previous
    Object.setPrototypeOf(this, ExportBackupError.prototype)
  }

  public static invalidStoreData(data: any): ExportBackupError {
    return new ExportBackupError('Received invalid data from IndexDB stores', { data })
  }

  public static error(error: unknown): ExportBackupError {
    return new ExportBackupError('An error occurred while exporting the backup', { previous: error })
  }

  public log() {
    const args: any[] = [this]

    if (this.previous)
      args.push(this.previous)
    if (this.data)
      args.push(this.data)

    console.error(...args)
  }
}
