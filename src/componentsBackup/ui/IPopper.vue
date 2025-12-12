<template>
  <Popper v-bind="$attrs" hover :open-delay="openDelay" :close-delay="closeDelay" :placement="placement">
    <slot />
    <template #content="props">
      <slot name="content" v-bind="props" />
    </template>
  </Popper>
</template>

<script lang="ts" setup>
import Popper from 'vue3-popper'

interface Props {
  placement?:
    | 'auto'
    | 'auto-start'
    | 'auto-end'
    | 'top'
    | 'top-start'
    | 'top-end'
    | 'bottom'
    | 'bottom-start'
    | 'bottom-end'
    | 'right'
    | 'right-start'
    | 'right-end'
    | 'left'
    | 'left-start'
    | 'left-end'
  openDelay?: number
  closeDelay?: number
}
interface Emits {

}

const { openDelay = 50, closeDelay = 20 } = defineProps<Props>()
defineEmits<Emits>()
</script>
