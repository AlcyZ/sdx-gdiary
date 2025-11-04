<template>
  <div class="dock">
    <button
      v-for="(item, i) in items"
      :key="i"
      :class="{ 'dock-active': item.active }"
      @click="$emit('changePage', item)"
    >
      <component :is="item.icon" />
      <span class="dock-label">{{ item.label }}</span>
    </button>
  </div>
</template>

<script lang="ts" setup generic="T = undefined">
import type { DockItem } from '../types'

interface Props {
  items: Array<DockItem<T>>
}

interface Emits {
  changePage: [item: DockItem<T>]
}

defineProps<Props>()
defineEmits<Emits>()
</script>
