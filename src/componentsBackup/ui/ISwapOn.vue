<template>
  <component :is="as" class="swap-on">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'

interface Props {
  as?: string | Component
}
interface Emits {

}

const { as = 'div' } = defineProps<Props>()
defineEmits<Emits>()
</script>
