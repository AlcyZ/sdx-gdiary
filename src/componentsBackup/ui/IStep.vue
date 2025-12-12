<template>
  <li class="step" :class="stepClass">
    <span v-if="!!$slots.icon" class="step-icon"><slot name="icon" /></span>
    <slot />
  </li>
</template>

<script lang="ts" setup>
import type { StepVariant } from '../../types'
import { computed } from 'vue'

interface Props {
  variant?: StepVariant | undefined
}
interface Emits {

}

const { variant } = defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  default: (props: Record<string, never>) => any
  icon: (props: Record<string, never>) => any
}>()

const stepClassMap: Record<StepVariant, string> = {
  neutral: 'step-neutral',
  primary: 'step-primary',
  secondary: 'step-secondary',
  accent: 'step-accent',
  info: 'step-info',
  success: 'step-success',
  warning: 'step-warning',
  error: 'step-error',
}

const stepClass = computed(() => variant !== undefined ? stepClassMap[variant] : undefined)
</script>
