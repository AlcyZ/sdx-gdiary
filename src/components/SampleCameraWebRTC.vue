<template>
  <div>
    <div class="my-2">
      <h1 class="text-xl text-center">
        WebRTC as
      </h1>

      <p>Beispiel für die Verwendung der WebRTC Kamera.</p>
    </div>

    <div>
      <button
        class="btn btn-primary"
        @click="startCamera"
      >
        Kamera öffnen
      </button>

      <button
        v-if="camera !== null"
        class="btn btn-secondary"
        @click="stopCamera"
      >
        Kamera stoppen
      </button>

      <div
        v-if="cameraError !== null"
        class="text-red-500"
      >
        {{ cameraError.message }}
      </div>
    </div>

    <div class="max-w-[200px] max-h-[200px]">
      <video ref="videoElement" autoplay playsinline />
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { WebRTCCamera } from '../modules/camera'

interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const videoElement = ref<HTMLVideoElement | null>(null)

const camera = ref<WebRTCCamera | null>(null)
const cameraError = ref<OpenCameraError | null>(null)

async function startCamera() {
  const result = await WebRTCCamera.open()

  if (result.ok) {
    camera.value = result.value
    cameraError.value = null

    if (videoElement.value) {
      videoElement.value.srcObject = camera.value.stream
    }
  }
  else {
    camera.value = null
    cameraError.value = result.error
  }
}

function stopCamera() {
  if (camera.value) {
    if (videoElement.value) {
      videoElement.value.srcObject = null
    }

    camera.value.close()
    camera.value = null
  }
}
</script>
