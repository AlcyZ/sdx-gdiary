<template>
  <component :is="componentTag" :to="to" class="card bg-base-100 shadow-sm">
    <div class="card-body" :class="{ 'gap-0': noGap }">
      <slot />

      <div v-if="!!$slots.actions" class="card-actions" :class="classActions">
        <slot name="actions" />
      </div>
    </div>
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

interface Props {
  classActions?: string
  justifyActionsBetween?: boolean
  to?: string | undefined
  noGap?: boolean
}
interface Emits {

}

const { classActions: classActionsProp, justifyActionsBetween, to } = defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  default: (props: Record<string, never>) => any
  actions: (props: Record<string, never>) => any
}>()

const classActions = computed(() => [
  classActionsProp,
  justifyActionsBetween ? 'justify-between' : undefined,
])

const componentTag = computed(() => to !== undefined ? RouterLink : 'div')
</script>
