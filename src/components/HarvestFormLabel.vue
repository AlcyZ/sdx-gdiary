<template>
  <label class="flex flex-col gap-y-0.5">
    <span class="text-base">
      <span class="font-bold" :class="labelClass">{{ label }}</span>
      <span
        :class="required
          ? 'font-semibold'
          : 'text-xs text-gray-400'"
      >&nbsp;{{ required ? '*' : '(Optional)' }}</span>
    </span>
    <slot />
    <span
      v-if="error"
      class="text-xs text-error px-4 mt-1"
      v-text="error"
    />
  </label>
</template>

<script lang="ts" setup>
interface Props {
  label: string
  labelClass?: string
  error?: string
  required?: boolean
}
interface Emits {

}

const { label, required = false } = defineProps<Props>()
defineEmits<Emits>()
</script>
