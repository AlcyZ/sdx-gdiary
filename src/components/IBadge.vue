<template>
  <component :is="as" class="badge" :class="badgeClass">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { BadgeSize, BadgeVariant } from '../types'
import { computed } from 'vue'

interface Props {
  outline?: boolean
  dash?: boolean
  soft?: boolean
  ghost?: boolean
  variant?: BadgeVariant | undefined
  size?: BadgeSize | undefined
  as?: 'div' | 'span' | 'p' | 'a' | 'button' | Component
}
interface Emits {

}

const {
  outline = false,
  dash = false,
  soft = false,
  ghost = false,
  as = 'div',
  variant,
  size,
} = defineProps<Props>()
defineEmits<Emits>()

const variantMap: Record<BadgeVariant, string> = {
  neutral: 'badge-neutral',
  primary: 'badge-primary',
  secondary: 'badge-secondary',
  accent: 'badge-accent',
  info: 'badge-info',
  success: 'badge-success',
  warning: 'badge-warning',
  error: 'badge-error',
}

const sizeMap: Record<BadgeSize, string> = {
  xs: 'badge-xs',
  sm: 'badge-sm',
  md: 'badge-md',
  lg: 'badge-lg',
  xl: 'badge-xl',
}

const badgeClass = computed((): Array<string> => [
  outline ? 'badge-outline' : undefined,
  dash ? 'badge-dash' : undefined,
  soft ? 'badge-soft' : undefined,
  ghost ? 'badge-ghost' : undefined,
  variant ? variantMap[variant] : undefined,
  size ? sizeMap[size] : undefined,
].filter((className: string | undefined): className is string => className !== undefined))
</script>
