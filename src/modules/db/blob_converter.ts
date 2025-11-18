import type { Result } from '../../types'
import { err, ok } from '../../util.ts'
import BlobConverterException from './blob_converter_exception.ts'

export default class BlobConverter {
  public static blobToArrayBuffer(blob: Blob): Promise<Result<ArrayBuffer, BlobConverterException>> {
    return new Promise((resolve) => {
      const reader = new FileReader()

      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result instanceof ArrayBuffer
          ? ok(event.target.result)
          : err(BlobConverterException.invalidType(typeof event.target?.result))
        resolve(result)
      }

      reader.onerror = () => resolve(err(BlobConverterException.domException(reader.error)))

      reader.readAsArrayBuffer(blob)
    })
  }
}
