<template>
  <label class="swap" :class="swapClass">
    <slot />
  </label>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  rotate?: boolean
  flip?: boolean
}
interface Emits {

}

const { rotate, flip } = defineProps<Props>()
defineEmits<Emits>()

const swapClass = computed(() => ({
  'swap-rotate': rotate,
  'swap-flip': flip,
}))
</script>
