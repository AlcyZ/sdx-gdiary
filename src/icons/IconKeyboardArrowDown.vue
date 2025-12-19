<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :height="sizePx"
    viewBox="0 -960 960 960"
    :width="sizePx"
    :fill="fill"
  >
    <path d="M480-357.85 253.85-584 296-626.15l184 184 184-184L706.15-584 480-357.85Z" /></svg>
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
