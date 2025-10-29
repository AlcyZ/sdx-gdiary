<template>
  <div>
    <span>Modus:</span>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const _sampleCamMode = ref<'webRTC' | 'native'>('webRTC')
</script>
