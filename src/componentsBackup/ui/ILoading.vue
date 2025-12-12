<template>
  <span class="loading" :class="loadingClass" />
</template>

<script lang="ts" setup>
import type { LoadingSize, LoadingType } from '../../types'
import { computed } from 'vue'

interface Props {
  type?: LoadingType | undefined
  spinner?: boolean
  dots?: boolean
  ring?: boolean
  ball?: boolean
  bars?: boolean
  infinity?: boolean
  size?: LoadingSize
}
interface Emits {

}

const {
  type: loadingType,
  spinner = false,
  dots = false,
  ring = false,
  ball = false,
  bars = false,
  infinity = false,
  size,
} = defineProps<Props>()
defineEmits<Emits>()

const sizeMap: Record<LoadingSize, string> = {
  xs: 'loading-xs',
  sm: 'loading-sm',
  md: 'loading-md',
  lg: 'loading-lg',
  xl: 'loading-xl',
}

const typeMap: Record<LoadingType, string> = {
  spinner: 'loading-spinner',
  dots: 'loading-dots',
  ring: 'loading-ring',
  ball: 'loading-ball',
  bars: 'loading-bars',
  infinity: 'loading-infinity',
}

const loadingClass = computed(() => [
  loadingType ? typeMap[loadingType] : undefined,
  !loadingType && spinner ? 'loading-spinner' : undefined,
  !loadingType && dots ? 'loading-dots' : undefined,
  !loadingType && ring ? 'loading-ring' : undefined,
  !loadingType && ball ? 'loading-ball' : undefined,
  !loadingType && bars ? 'loading-bars' : undefined,
  !loadingType && infinity ? 'loading-infinity' : undefined,
  size ? sizeMap[size] : undefined,
])
</script>
