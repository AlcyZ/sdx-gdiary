<template>
  <IPopper>
    <slot name="default" />

    <template #content>
      <slot name="default" />
    </template>
  </IPopper>
</template>

<script lang="ts" setup>
import IPopper from './IPopper.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  default: (props: Record<string, never>) => any
}>()
</script>
