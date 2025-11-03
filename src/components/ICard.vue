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
interface Props {
  classActions?: string | Array<string> | Record<string, boolean>
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  default: (props: Record<string, never>) => any
  actions: (props: Record<string, never>) => any
}>()
</script>
