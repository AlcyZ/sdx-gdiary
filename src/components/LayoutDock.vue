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

<script lang="ts" setup>
import type { DockItem } from '../types'

interface Props {
  items: Array<DockItem>
}

interface Emits {
  changePage: [item: DockItem]
}

defineProps<Props>()
defineEmits<Emits>()
</script>
