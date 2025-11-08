<template>
  <component :is="as" class="btn" :class="btnClass" :type="as === 'button' ? 'button' : undefined">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { ButtonSize, ButtonVariant } from '../../types'
import { computed } from 'vue'

interface Props {
  as?: 'button' | 'a' | Component
  wide?: boolean
  block?: boolean
  square?: boolean
  circle?: boolean
  outline?: boolean
  dash?: boolean
  soft?: boolean
  ghost?: boolean
  variant?: ButtonVariant | undefined
  size?: ButtonSize | undefined
}
interface Emits {

}

const {
  wide = false,
  block = false,
  square = false,
  circle = false,
  as = 'button',
  outline = false,
  dash = false,
  soft = false,
  ghost = false,
  variant,
  size,
} = defineProps<Props>()
defineEmits<Emits>()

const variantMap: Record<ButtonVariant, string> = {
  neutral: 'btn-neutral',
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  accent: 'btn-accent',
  info: 'btn-info',
  success: 'btn-success',
  warning: 'btn-warning',
  error: 'btn-error',
}

const sizeMap: Record<ButtonSize, string> = {
  xs: 'btn-xs',
  sm: 'btn-sm',
  md: 'btn-md',
  lg: 'btn-lg',
  xl: 'btn-xl',
}

const btnClass = computed((): Array<string> => [
  wide ? 'btn-wide' : undefined,
  block ? 'btn-block' : undefined,
  square ? 'btn-square' : undefined,
  circle ? 'btn-circle' : undefined,
  soft ? 'btn-soft' : undefined,
  ghost ? 'btn-ghost' : undefined,
  variant ? variantMap[variant] : undefined,
  size ? sizeMap[size] : undefined,
  outline ? 'btn-outline' : undefined,
  dash ? 'btn-dash' : undefined,
  soft ? 'btn-soft' : undefined,
  ghost ? 'btn-ghost' : undefined,
].filter((className: string | undefined): className is string => className !== undefined))
</script>
