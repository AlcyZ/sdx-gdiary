<template>
  <button
    class="inline-flex items-center self-center justify-center h-10 gap-2 px-5 text-sm font-medium tracking-wide transition duration-300 rounded focus-visible:outline-none justify-self-center whitespace-nowrap bg-emerald-50 text-emerald-500 hover:bg-emerald-100 hover:text-emerald-600 focus:bg-emerald-200 focus:text-emerald-700 disabled:cursor-not-allowed disabled:border-emerald-300 disabled:bg-emerald-100 disabled:text-emerald-400 disabled:shadow-none"
  >
    <span class="relative only:-mx-5">
      <slot />
    </span>
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
