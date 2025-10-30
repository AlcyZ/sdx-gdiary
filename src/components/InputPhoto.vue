<template>
  <div>
    <div class="flex justify-between">
      <div class="my-1 relative flex-1">
        <label
          :for="id"
          class="cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-transparent before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
        >
          {{ label }}
        </label>
      </div>

      <div class="space-x-1">
        <BtnPrimaryIcon
          v-if="camera === null"
          @click="openCamera"
        >
          <IconCamera />
        </BtnPrimaryIcon>
        <BtnSecondary
          v-else
          @click="closeCamera"
        >
          <IconCameraOff />
        </BtnSecondary>
      </div>
    </div>

    <div class="my-2 space-y-1">
      <div class="flex">
        <label
          v-if="cameraError"
          class="text-xs text-red-400 flex-shrink min-w-0 break-words px-4"
        >{{ cameraError.message }}</label>

        <div v-if="camera" class="toolbar flex items-center justify-end space-x-1 ml-auto">
          <BtnSecondary @click="toggle">
            <IconSwitchCamera />
          </BtnSecondary>

          <BtnPrimaryIcon @click="captureImage">
            <IconCircle />
          </BtnPrimaryIcon>
        </div>
      </div>

      <div
        ref="videoContainer"
        class="max-w-full"
      />

      <div v-if="displayPreview" class="flex justify-between">
        <img
          class="max-w-1/3 rounded-xs"
          :src="modelValue"
          alt="plant preview"
        >

        <div class="flex flex-col space-y-1">
          <BtnSecondary @click="$emit('update:modelValue', '')">
            <IconX />
          </BtnSecondary>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { WebRTCCameraOpts } from '../modules/camera/webRTCCamera.ts'
import {
  Camera as IconCamera,
  CameraOff as IconCameraOff,
  Circle as IconCircle,
  SwitchCamera as IconSwitchCamera,
  X as IconX,
} from 'lucide-vue-next'
import { computed, ref, useId } from 'vue'
import { useWebRTCCamera } from '../composables/useWebRTCCamera.ts'
import { isBase64String } from '../modules/db'
import BtnPrimaryIcon from './BtnPrimaryIcon.vue'
import BtnSecondary from './BtnSecondaryIcon.vue'

interface Props {
  label: string
  modelValue?: string
}
interface Emits {
  'update:modelValue': [img: string]
}

const { modelValue = '' } = defineProps<Props>()
const emits = defineEmits<Emits>()

const id = useId()
const videoContainer = ref<HTMLDivElement | null>(null)

const {
  camera,
  cameraError,
  start,
  stop,
  toggle,
} = useWebRTCCamera()

const displayPreview = computed((): boolean => isBase64String(modelValue))

async function openCamera() {
  if (videoContainer.value === null) {
    console.error('[InputPhoto:openCamera] - videoContainer element is null]')
    return
  }

  const opts: WebRTCCameraOpts = {
    video: {
      classList: ['max-w-full'],
    },
  }
  await start(videoContainer.value, opts)
}

async function closeCamera() {
  if (videoContainer.value !== null) {
    videoContainer.value.innerHTML = ''
  }
  await stop()
}

async function captureImage() {
  if (camera.value === null) {
    return
  }

  const base64 = camera.value.captureBase64()
  emits('update:modelValue', base64)

  await closeCamera()
}
</script>
