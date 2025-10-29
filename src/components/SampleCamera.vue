<template>
  <div>
    <div class="flex items-center justify-center mt-6">
      <div class="toggle">
        <button
          class="toggle-item"
          :class="{ active: camMode === 'webRTC' }"
          @click="changeMode('webRTC')"
        >
          WebRTC
        </button>
        <button
          class="toggle-item"
          :class="{ active: camMode === 'native' }"
          @click="changeMode('native')"
        >
          Native
        </button>
      </div>
    </div>

    <SampleCameraWebRTC v-if="camMode === 'webRTC'" />
    <SampleCameraNative v-else />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import SampleCameraNative from './SampleCameraNative.vue'
import SampleCameraWebRTC from './SampleCameraWebRTC.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

type CamMode = 'webRTC' | 'native'
const camMode = ref<CamMode>('webRTC')

function changeMode(mode: CamMode) {
  camMode.value = mode
}
</script>
