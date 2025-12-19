<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :height="sizePx"
    viewBox="0 -960 960 960"
    :width="sizePx"
    :fill="fill"
  >
    <path d="m480-541.85-184 184L253.85-400 480-626.15 706.15-400 664-357.85l-184-184Z" /></svg>
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
