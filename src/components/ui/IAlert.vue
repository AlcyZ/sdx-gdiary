<template>
  <div role="alert" class="alert" :class="alertClass">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import type { AlertVariant } from '../../types'
import { computed } from 'vue'

interface Props {
  variant?: AlertVariant | undefined
  outline?: boolean
  dash?: boolean
  soft?: boolean
  vertical?: boolean
}
interface Emits {

}

const {
  variant,
  outline = false,
  dash = false,
  soft = false,
  vertical = false,
} = defineProps<Props>()
defineEmits<Emits>()

const variantMap: Record<AlertVariant, string> = {
  info: 'alert-info',
  success: 'alert-success',
  warning: 'alert-warning',
  error: 'alert-error',
}

const alertClass = computed(() => [
  variant ? variantMap[variant] : undefined,
  outline ? 'alert-outline' : undefined,
  dash ? 'alert-dash' : undefined,
  soft ? 'alert-soft' : undefined,
  vertical ? 'alert-vertical' : undefined,
])
</script>
