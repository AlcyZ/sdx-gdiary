import type { WebRTCCameraOpts } from '../modules/camera/webRTCCamera.ts'
import { ref } from 'vue'
import { WebRTCCamera } from '../modules/camera/webRTCCamera.ts'

export function useWebRTCCamera() {
  const camera = ref<WebRTCCamera | null>(null)
  const cameraError = ref<OpenStreamError | null>(null)

  const start = async (videoContainer: Node, opts?: WebRTCCameraOpts) => {
    const result = await WebRTCCamera.open(opts)

    if (result.ok) {
      camera.value = result.value
      cameraError.value = null

      videoContainer.appendChild(camera.value.element)
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

  return {
    camera,
    cameraError,
    start,
    stop,
    toggle,
  }
}
