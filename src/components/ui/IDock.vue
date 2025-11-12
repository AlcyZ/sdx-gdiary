<template>
  <div class="dock">
    <RouterLink
      v-for="(item, i) in items"
      :key="i"
      :class="{ 'dock-active': $route.path.startsWith(item.to) }"
      :to="item.to"
    >
      <component :is="item.icon" />
      <span class="dock-label">{{ item.label }}</span>
    </RouterLink>
  </div>
</template>

<script lang="ts" setup>
import type { DockItem } from '../../types'

interface Props {
  items: Array<DockItem>
}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
