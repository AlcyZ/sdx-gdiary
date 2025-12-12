<template>
  <div class="flex flex-col min-h-screen w-full pb-20 overflow-hidden">
    <slot name="top-navigation" />

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
