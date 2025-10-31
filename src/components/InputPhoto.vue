<template>
  <div class="mt-3">
    <div
      class="flex items-center justify-between"
    >
      <span>{{ label }}</span>

      <div class="flex items-center space-x-1">
        <template v-if="!isCameraActive">
          <button
            class="btn btn-sm btn-square"
            @click="startCamera"
          >
            <IconCamera />
          </button>
        </template>
        <template v-else>
          <button
            class="btn btn-circle bg-red-400 text-base-200"
            @click="captureImage"
          >
            <IconCircle />
          </button>

          <button
            class="btn btn-sm btn-square"
            @click="toggle"
          >
            <IconSwitchCamera />
          </button>

          <button
            class="btn btn-sm btn-square"
            @click="stopCamera"
          >
            <IconCameraOff />
          </button>
        </template>
      </div>
    </div>

    <div v-if="showPreview" class="flex justify-between mt-2">
      <img
        :src="modelValue"
        alt="photo preview"
        class="max-w-1/3 rounded-xs"
      >

      <button
        class="btn btn-sm btn-circle ml-1"
        @click="$emit('update:modelValue', '')"
      >
        <IconRemove />
      </button>
    </div>

    <div
      v-if="cameraError"
      class="mb-0"
    >
      <span class="text-xs text-red-400">{{ cameraError.message }}</span>
    </div>

    <div
      v-show="isCameraActive"
      ref="cameraContainer"
      class="mt-2"
    />
  </div>
</template>

<script lang="ts" setup>
import {
  Camera as IconCamera,
  CameraOff as IconCameraOff,
  CircleDot as IconCircle,
  X as IconRemove,
  SwitchCamera as IconSwitchCamera,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useWebRTCCamera } from '../composables/useWebRTCCamera.ts'
import { isBase64String } from '../modules/db'

interface Props {
  label: string
  modelValue: string
}
interface Emits {
  'update:modelValue': [value: string]
}

const { modelValue } = defineProps<Props>()
const emit = defineEmits<Emits>()

const {
  isCameraActive,
  cameraError,
  start,
  stop,
  toggle,
  capture,
} = useWebRTCCamera()

const cameraContainer = ref<HTMLDivElement | null>(null)
const showPreview = computed((): boolean => isBase64String(modelValue))

async function startCamera() {
  if (cameraContainer.value === null) {
    console.warn('[InputPhoto:startCamera] - Could not start camera, camera container element not found!')
    return
  }

  await start(cameraContainer.value)
}

async function stopCamera() {
  if (cameraContainer.value !== null) {
    cameraContainer.value.innerHTML = ''
  }

  await stop()
}

async function captureImage() {
  const imageBase64 = capture()
  emit('update:modelValue', imageBase64)

  await stopCamera()
}
</script>
