<template>
  <!-- Component: Base primary button with icon  -->
  <button
    class="inline-flex items-center self-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide text-white transition duration-300 rounded focus-visible:outline-none whitespace-nowrap bg-emerald-500 hover:bg-emerald-600 focus:bg-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-300 disabled:shadow-none"
  >
    <span class="relative only:-mx-5">
      <slot />
    </span>
  </button>
  <!-- End Base primary button with icon  -->
</template>

<script lang="ts" setup>
interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
