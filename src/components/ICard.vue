<template>
  <div class="overflow-hidden bg-white rounded shadow-md text-slate-500 shadow-slate-200">
    <div class="p-6">
      <slot />
    </div>
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
