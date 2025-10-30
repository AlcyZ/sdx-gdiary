<template>
  <button
    class="inline-flex items-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded focus-visible:outline-none whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
  >
    <slot />
  </button>
</template>

<script lang="ts" setup>
interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
