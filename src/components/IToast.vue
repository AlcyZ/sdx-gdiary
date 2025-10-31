<template>
  <div class="toast z-1000" :class="toastClassList">
    <div class="alert flex items-center justify-between" :class="alertClassList">
      <span>{{ message }}</span>

      <button
        class="btn btn-circle btn-soft btn-xs"
        :class="btnClassList"
        @click="$emit('close')"
      >
        <IconX />
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { ResponsiveBreakpoint, ToastPosition, ToastVariant } from '../types'
import {
  X as IconX,
} from 'lucide-vue-next'
import { computed, onMounted } from 'vue'

interface Props {
  message: string
  variant?: ToastVariant
  position?: ToastPosition
  positionMobile?: ToastPosition
  duration?: number | undefined
}

interface Emits {
  close: []
}

const { variant, position = 'te', positionMobile = 'bc', duration } = defineProps<Props>()
const emit = defineEmits<Emits>()

const alertClassMap: { [K in ToastVariant]: string } = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
}

const btnClassMap: { [K in ToastVariant]: string } = {
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
}

const toastClassList = computed(
  () => [
    ...getPositionClasses(position, 'md'),
    ...getPositionClasses(positionMobile),
  ],
)
const alertClassList = computed(() => [
  variant !== undefined ? alertClassMap[variant] : undefined,
  variant === 'error' || variant === 'warning' ? 'text-base-100' : undefined,
])
const btnClassList = computed(() => variant !== undefined ? btnClassMap[variant] : undefined)

function getPositionClasses(pos: ToastPosition, responsive?: ResponsiveBreakpoint): Array<string> {
  const start = 'toast-start'
  const center = 'toast-center'
  const end = 'toast-end'
  const top = 'toast-top'
  const middle = 'toast-middle'
  const bottom = 'toast-bottom'

  const getPos = (x: string, y: string, extra: Array<string> = []): Array<string> =>
    responsive !== undefined
      ? [`${responsive}:${x}`, `${responsive}:${y}`, ...extra]
      : [x, y, ...extra]

  switch (pos) {
    case 'ts':
      return getPos(top, start)
    case 'tc':
      return getPos(top, center)
    case 'te':
      return getPos(top, end)
    case 'ms':
      return getPos(middle, start)
    case 'mc':
      return getPos(middle, center)
    case 'me':
      return getPos(middle, end)
    case 'bs':
      return getPos(bottom, start, ['mb-16'])
    case 'bc':
      return getPos(bottom, center, ['mb-16'])
    case 'be':
    default:
      return getPos(bottom, end, ['mb-16'])
  }
}

onMounted(() => {
  if (duration !== undefined) {
    setTimeout(() => emit('close'), duration)
  }
})
</script>
