<template>
  <component :is="as" class="card-title">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'

interface Props {
  as?: Component | 'div' | 'span' | 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'
}
interface Emits {

}

const { as = 'h1' } = defineProps<Props>()
defineEmits<Emits>()
</script>
