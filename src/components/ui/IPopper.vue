<template>
  <Popper v-bind="$attrs" hover open-delay="200" close-delay="100">
    <slot />
    <template #content="props">
      <slot name="content" v-bind="props" />
    </template>
  </Popper>
</template>

<script lang="ts" setup>
import Popper from 'vue3-popper'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
