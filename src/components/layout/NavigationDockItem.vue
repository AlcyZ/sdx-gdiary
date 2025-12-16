<template>
  <RouterLink
    class="
      flex-1 py-md flex flex-col items-center justify-center relative select-none
      duration-120 ease-linear active:scale-[0.925] active:opacity-80 touch-manipulation
      ripple
    "
    style="-webkit-touch-callout: none; transition: transform ease, opacity ease;"
    :to="dock.to"
  >
    <component :is="dock.icon" />
    <span class="text-xs">{{ dock.label }}</span>
    <transition
      appear
      enter-active-class="transition-all duration-300 ease-out"
      enter-from-class="opacity-0 scale-x-0"
      enter-to-class="opacity-100 scale-x-100"
      leave-active-class="transition-all duration-200 ease-in"
      leave-from-class="opacity-100 scale-x-100"
      leave-to-class="opacity-0 scale-x-0"
    >
      <div
        v-if="$route.path.startsWith(dock.to)"
        class="h-[3px] w-2/5 bg-dim rounded-full absolute bottom-1"
      />
    </transition>
  </RouterLink>
</template>

<script lang="ts" setup>
import type { DockItem } from '../../types'

interface Props {
  dock: DockItem
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>

<style scoped>
.ripple {
  position: relative;
  overflow: hidden;
}

.ripple::after {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at center, rgba(0,0,0,0.15) 10%, transparent 60%);
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 200ms ease, transform 200ms ease;
  pointer-events: none;
}

.ripple:active::after {
  opacity: 1;
  transform: scale(1);
}
</style>
