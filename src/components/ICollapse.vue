<template>
  <div class="collapse" :class="collapseClass">
    <input type="radio" :name="name">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  name: string
  arrow?: boolean
  plus?: boolean
}
interface Emits {

}

const { arrow = false, plus = false } = defineProps<Props>()
defineEmits<Emits>()

const collapseClass = computed(() => [
  arrow ? 'collapse-arrow' : undefined,
  plus ? 'collapse-plus' : undefined,
].filter(Boolean))
</script>
