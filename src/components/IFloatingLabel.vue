<template>
  <label class="floating-label">
    <slot />
    <span>{{ label }}</span>
  </label>
</template>

<script lang="ts" setup>
interface Props {
  label: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
