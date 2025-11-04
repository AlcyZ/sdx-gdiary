<template>
  <div class="bg-neutral-200 w-full min-h-screen pb-16 overflow-x-hidden">
    <slot />

    <LayoutDock
      :items="docks"
      @change-page="$emit('changePage', $event)"
    />
  </div>
</template>

<script lang="ts" setup generic="T = undefined">
import type { DockItem } from '../types'
import LayoutDock from '../components/LayoutDock.vue'

interface Props {
  docks: Array<DockItem<T>>
}
interface Emits {
  changePage: [page: DockItem<T>]
}

defineProps<Props>()
defineEmits<Emits>()
</script>
