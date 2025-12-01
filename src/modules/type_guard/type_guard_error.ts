export default class TypeGuardError<E> extends Error {
  private readonly value: unknown
  private readonly error: E | undefined

  constructor(value: unknown, message?: string, error?: E) {
    super(message)
    this.value = value
    this.error = error

    Object.setPrototypeOf(this, TypeGuardError.prototype)
  }

  public static isNotObject(value: unknown): TypeGuardError<never> {
    return new TypeGuardError(value, 'Value must be an object')
  }

  public static from<E>(value: unknown, error: E): TypeGuardError<E> {
    return new TypeGuardError(value, '', error)
  }

  public log() {
    const errors: Array<any> = [this, {
      value: this.value,
    }]

    if (this.error)
      errors.push(this.error)

    console.error(...errors)
  }
}
