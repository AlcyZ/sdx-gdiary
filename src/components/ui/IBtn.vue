<template>
  <component
    :is="as"
    ref="button"
    class="btn"
    :class="btnClass"
    :style="btnStyle"
    :type="as === 'button' ? 'button' : undefined"
    :disabled="loading"
  >
    <ILoading
      v-if="loading"
      :type="loadingType"
      spinner
    />
    <slot v-else />
  </component>
</template>

<script lang="ts" setup>
import type {ButtonSize, ButtonVariant, LoadingType} from '../../types'
import { computed, ref, watch } from 'vue'
import ILoading from './ILoading.vue'

interface Props {
  as?: 'button' | 'a'
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
  loading?: boolean
  loadingType?: LoadingType
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
  loading,
} = defineProps<Props>()
defineEmits<Emits>()

const button = ref<HTMLButtonElement | HTMLAnchorElement | undefined>()
const btnStyle = ref('')

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

watch(
  () => loading,
  isLoading => btnStyle.value = isLoading && button.value !== undefined
    ? `width: ${button.value.offsetWidth}px`
    : '',
)
</script>
