<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <slot />

      <div v-if="!!$slots.actions" class="card-actions" :class="classActions">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  classActions?: string
  justifyActionsBetween?: boolean
}
interface Emits {

}

const { classActions: classActionsProp, justifyActionsBetween } = defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  default: (props: Record<string, never>) => any
  actions: (props: Record<string, never>) => any
}>()

const classActions = computed(() => [
  classActionsProp,
  justifyActionsBetween ? 'justify-between' : undefined,
])
</script>
