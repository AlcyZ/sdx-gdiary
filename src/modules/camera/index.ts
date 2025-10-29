import { err, ok } from '../../util.ts'

const DEFAULT_FACING_MODE: FacingMode = 'front'

export class WebRTCCamera {
  public readonly element: HTMLVideoElement

  private _stream: MediaStream
  private _facingMode: FacingMode

  private constructor(stream: MediaStream, element: HTMLVideoElement, facingMode: FacingMode) {
    this.element = element
    this._stream = stream
    this._facingMode = facingMode

    this.element.srcObject = this._stream
  }

  public static async open(facingModeArg?: FacingMode): Promise<Result<WebRTCCamera, OpenStreamError>> {
    const facingMode = facingModeArg || DEFAULT_FACING_MODE
    const result = await this.safeOpenStream(facingMode)

    if (result.ok) {
      const element = document.createElement('video')
      element.autoplay = true
      element.playsInline = true

      return ok(new WebRTCCamera(result.value, element, facingMode))
    }

    return result
  }

  public async toggleFacingMode(): Promise<void> {
    const newFacingMode: FacingMode = this.facingMode === 'front' ? 'back' : 'front'
    await this.changeFacingMode(newFacingMode)
  }

  public async changeFacingMode(facingMode: FacingMode): Promise<Result<undefined, OpenStreamError>> {
    if (this._facingMode === facingMode) {
      return ok(undefined)
    }

    this.closeStream()
    const result = await WebRTCCamera.safeOpenStream(facingMode)

    if (result.ok) {
      this._stream = result.value
      this.element.srcObject = this._stream
      this._facingMode = facingMode

      return ok(undefined)
    }

    return result
  }

  public close(): void {
    this.element.srcObject = null
    this.closeStream()
  }

  public get facingMode(): FacingMode {
    return this._facingMode
  }

  private closeStream(): void {
    this._stream
      .getTracks()
      .forEach(track => track.stop())
  }

  private static async safeOpenStream(facingMode: FacingMode): Promise<Result<MediaStream, OpenStreamError>> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: convertFacingMode(facingMode),
        },
      })

      return ok(stream)
    }
    catch (e) {
      let message = 'Unbekannter Fehler beim Öffnen der Kamera'
      const payload: unknown = e

      if (e instanceof DOMException) {
        // Standardisierte Errors von getUserMedia
        switch (e.name) {
          case 'NotAllowedError':
            message = 'Zugriff auf die Kamera verweigert'
            break
          case 'NotFoundError':
            message = 'Keine Kamera gefunden'
            break
          case 'NotReadableError':
            message = 'Kamera kann nicht gelesen werden (bereits in Benutzung?)'
            break
          case 'OverconstrainedError':
            message = 'Keine Kamera entspricht den Constraints'
            break
          case 'SecurityError':
            message = 'Sicherheitsfehler beim Zugriff auf die Kamera'
            break
          default:
            message = e.message || message
        }
      }

      return err({ message, payload })
    }
  }
}

function convertFacingMode(mode: FacingMode): string {
  switch (mode) {
    case 'front':
      return 'user'
    case 'back':
    default:
      return 'environment'
  }
}
