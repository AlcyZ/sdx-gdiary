<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :height="sizePx"
    viewBox="0 -960 960 960"
    :width="sizePx"
    :fill="fill"
  >
    <path d="m517.85-480-184-184L376-706.15 602.15-480 376-253.85 333.85-296l184-184Z" /></svg>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  size?: number
  fill?: string
}
interface Emits {

}

const { size = 24, fill = '#030303' } = defineProps<Props>()
defineEmits<Emits>()

const sizePx = computed(() => `${size}px`)
</script>
