import type { WebRTCCameraOpts } from '../modules/camera/webRTCCamera.ts'
import { computed, ref } from 'vue'
import { WebRTCCamera } from '../modules/camera/webRTCCamera.ts'

export function useWebRTCCamera() {
  const camera = ref<WebRTCCamera | null>(null)
  const cameraError = ref<OpenStreamError | null>(null)

  const isCameraActive = computed((): boolean => camera.value !== null)

  const start = async (videoContainer: Node, opts?: WebRTCCameraOpts) => {
    const result = await WebRTCCamera.open(opts)

    if (result.ok) {
      camera.value = result.value
      cameraError.value = null

      videoContainer.appendChild(result.value.element)
    }
    else {
      camera.value = null
      cameraError.value = result.error
    }
  }

  const stop = async () => {
    if (camera.value === null) {
      return
    }

    camera.value.close()
    camera.value = null
  }

  const toggle = async () => {
    if (camera.value === null) {
      return
    }

    await camera.value.toggleFacingMode()
  }

  const capture = (): string => {
    return camera.value?.captureBase64() || ''
  }

  return {
    camera,
    cameraError,
    isCameraActive,
    start,
    stop,
    toggle,
    capture,
  }
}
