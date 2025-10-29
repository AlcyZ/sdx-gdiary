<template>
  <div>
    <div class="my-2">
      <h1 class="text-xl text-center">
        WebRTCa
      </h1>

      <p>Beispiel für die Verwendung der WebRTC Kamera.</p>
    </div>

    <!-- camera toolbar -->
    <div class="flex justify-center items-center">
      <template v-if="camera === null">
        <button
          class="btn btn-primary"
          @click="startCamera"
        >
          <IconCamera />
        </button>
      </template>
      <template v-else>
        <button
          class="btn btn-primary" @click="capture"
        >
          <IconCircle />
        </button>
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

    <!-- captured images -->
    <div v-if="images.length > 0" class="border">
      <div
        v-for="(image, i) in images"
        :key="i"
        class="flex items-center justify-between"
      >
        <div>
          <img
            class="max-h-48"
            :alt="image"
            :src="image"
          >
        </div>
        <button class="btn btn-secondary" @click="removeImage(i)">
          <IconX />
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { WebRTCCameraOpts } from '../modules/camera'
import {
  Camera as IconCamera,
  CameraOff as IconCameraOff,
  SwitchCamera as IconCameraSwitch,
  Circle as IconCircle,
  X as IconX,
} from 'lucide-vue-next'
import { ref } from 'vue'
import { useWebRTCCamera } from '../composables/useWebRTCCamera.ts'

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
} = useWebRTCCamera()

const images = ref<Array<string>>([])

async function startCamera() {
  if (videoContainer.value === null) {
    console.error('[SampleCameraWebRTC:startCamera] - Could not start camera, video element not found!')
    return
  }
  const opts: WebRTCCameraOpts = {
    video: {
      classList: ['max-w-[200px]', 'max-h-[200px]'],
    },
  }

  await start(videoContainer.value, opts)
}

async function stopCamera() {
  if (videoContainer.value !== null) {
    videoContainer.value.innerHTML = ''
  }

  await stop()
}

function capture() {
  if (camera.value === null) {
    return
  }

  const base64 = camera.value.captureBase64()

  images.value.push(base64)
}

function removeImage(index: number) {
  images.value.splice(index, 1)
}
</script>
