<template>
  <div>
    <div class="my-2">
      <h1 class="text-xl text-center">
        WebRTC def
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

      <div v-if="camera !== null">
        <button class="btn btn-secondary" @click="stopCamera">
          Kamera schließen
        </button>
        <button class="btn btn-secondary" @click="camera.changeFacingMode('front')">
          Front Kamera
        </button>
        <button class="btn btn-secondary" @click="camera.changeFacingMode('back')">
          Back Kamera
        </button>
        <button class="btn btn-secondary" @click="camera.toggleFacingMode">
          Toggle Kamera
        </button>
      </div>
    </div>

    <div ref="videoContainer" class="max-w-[200px] max-h-[200px]" />
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

const videoContainer = ref<HTMLDivElement | null>(null)

const camera = ref<WebRTCCamera | null>(null)
const cameraError = ref<OpenStreamError | null>(null)

async function startCamera() {
  const result = await WebRTCCamera.open('front')

  if (result.ok) {
    camera.value = result.value
    cameraError.value = null

    if (videoContainer.value) {
      videoContainer.value.appendChild(camera.value.element)
    }
  }
  else {
    camera.value = null
    cameraError.value = result.error
  }
}

function stopCamera() {
  if (camera.value) {
    camera.value.close()
    camera.value = null
  }
}
</script>
