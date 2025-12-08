<template>
  <component :is="as" class="swap-intermediate">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'

interface Props {
  as: string | Component
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
