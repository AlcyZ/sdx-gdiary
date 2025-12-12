<template>
  <div class="shadow-sm rounded-field px-6 py-4">
    <div class="flex items-center justify-between">
      <h3>
        <span class="font-semibold opacity-80">{{ day }}</span>&nbsp;
        <span class="opacity-60">{{ time }}</span>
      </h3>

      <slot name="actions" />
    </div>

    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  time?: string
  day?: string
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
