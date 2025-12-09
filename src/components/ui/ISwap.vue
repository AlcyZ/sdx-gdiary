<template>
  <label
    class="swap"
    :class="swapClass"
    @click="$emit('update:modelValue', !isActive)"
  >
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

const isActive = defineModel<boolean>({ required: true })

const swapClass = computed(() => ({
  'swap-rotate': rotate,
  'swap-flip': flip,
  'swap-active': isActive.value,
}))
</script>
