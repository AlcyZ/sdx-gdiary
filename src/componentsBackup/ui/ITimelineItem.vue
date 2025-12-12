<template>
  <li>
    <hr v-if="!hideStartLine">
    <div
      v-if="!!$slots.start"
      class="timeline-start"
      :class="boxStart ? 'timeline-box' : undefined"
    >
      <slot name="start" />
    </div>
    <div
      v-if="!!$slots.middle"
      class="timeline-middle"
      :class="boxMiddle ? 'timeline-box' : undefined"
    >
      <slot name="middle" />
    </div>
    <div
      v-if="!!$slots.end"
      class="timeline-end"
      :class="boxEnd ? 'timeline-box' : undefined"
    >
      <slot name="end" />
    </div>
    <hr v-if="!hideEndLine">
  </li>
</template>

<script lang="ts" setup>
interface Props {
  hideStartLine?: boolean
  hideEndLine?: boolean
  boxStart?: boolean
  boxMiddle?: boolean
  boxEnd?: boolean
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

defineSlots<{
  start: (props: Record<string, never>) => any
  middle: (props: Record<string, never>) => any
  end: (props: Record<string, never>) => any
}>()
</script>
