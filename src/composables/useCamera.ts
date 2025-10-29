import { ref } from 'vue'
import { WebRTCCamera } from '../modules/camera'

type WebRTCCameraInstance = InstanceType<typeof WebRTCCamera>

interface CameraOpts {
  facingMode?: FacingMode
}

export function useCamera(opts?: CameraOpts) {
  const facingMode = opts?.facingMode ?? 'front'

  const camera = ref<WebRTCCameraInstance | null>(null)
  const cameraError = ref<OpenStreamError | null>(null)

  const start = async (videoContainer: Node) => {
    const result = await WebRTCCamera.open(facingMode)

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
