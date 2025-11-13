const BlobConverterExceptionInvalidType = 'invalid-type' as const
const BlobConverterExceptionDomException = 'dom-exception' as const
type BlobConverterExceptionKind = typeof BlobConverterExceptionInvalidType
  | typeof BlobConverterExceptionDomException

export default class BlobConverterException extends Error {
  private readonly kind: BlobConverterExceptionKind
  private readonly previous: DOMException | null

  constructor(message: string, kind: BlobConverterExceptionKind, previous: DOMException | null = null) {
    super(message)
    this.kind = kind
    this.previous = previous
  }

  public static invalidType(type: string): BlobConverterException {
    return new BlobConverterException(
      `Invalid FileReader result type (${type})`,
      BlobConverterExceptionInvalidType,
    )
  }

  public static domException(exception: DOMException | null): BlobConverterException {
    const message = exception !== null
      ? `FileReader error: DOMException (${exception.name}): ${exception.message}`
      : 'FileReader unknown error'

    return new BlobConverterException(
      message,
      BlobConverterExceptionDomException,
      exception,
    )
  }

  public log() {
    const message = `BlobConverterException (${this.kind}): ${this.message}`

    this.previous !== null
      ? console.error(message, this.previous)
      : console.error(message)
  }
}
