<template>
  <div class="inset-shadow-sm bg-amber-50 inset-shadow-amber-400/40 px-4 py-2 rounded-field mt-3 text-sm text-gray-500">
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
