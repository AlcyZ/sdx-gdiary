export default class ImportBackupError extends Error {
  data: any

  constructor(message: string, data?: any) {
    super(message)
    this.name = 'ImportBackupError'
    this.data = data
    Object.setPrototypeOf(this, ImportBackupError.prototype)
  }
}
