<template>
  <div>
    <div class="my-2">
      <h1 class="text-xl text-center">
        WebRTCa
      </h1>

      <p>Beispiel für die Verwendung der WebRTC Kamera.</p>
    </div>

    <!-- camera toolbar -->
    <div>
      <template v-if="camera === null">
        <button
          class="btn btn-primary"
          @click="startCamera"
        >
          <IconCamera />
        </button>
      </template>
      <template v-else>
        <button class="btn btn-secondary" @click="stopCamera">
          <IconCameraOff />
        </button>
        <button class="btn btn-secondary flex" @click="toggle">
          <IconCameraSwitch />
        </button>
      </template>
    </div>

    <div v-if="cameraError">
      <p class="text-red-600">
        {{ cameraError.message }}
      </p>
    </div>

    <!-- camera content -->
    <div ref="videoContainer" class="max-w-[200px] max-h-[200px]" />
  </div>
</template>

<script lang="ts" setup>
import {
  Camera as IconCamera,
  CameraOff as IconCameraOff,
  SwitchCamera as IconCameraSwitch,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { useCamera } from '../composables/useCamera.ts'

interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const videoContainer = ref<HTMLDivElement | null>(null)

const {
  camera,
  cameraError,
  start,
  stop,
  toggle,
} = useCamera()

async function startCamera() {
  if (videoContainer.value === null) {
    console.error('[SampleCameraWebRTC:startCamera] - Could not start camera, video element not found!')
    return
  }

  await start(videoContainer.value)
}

async function stopCamera() {
  if (videoContainer.value !== null) {
    videoContainer.value.innerHTML = ''
  }

  await stop()
}
</script>
