<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    :height="sizePx"
    viewBox="0 -960 960 960"
    :width="sizePx"
    :fill="fill"
  >
    <path d="M560-240 320-480l240-240 56 56-184 184 184 184-56 56Z" /></svg>
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
