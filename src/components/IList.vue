<template>
  <ul class="list bg-base-100 rounded-box shadow-md">
    <li
      v-if="label"
      class="p-4 pb-2 text-xs opacity-60 tracking-wide"
    >
      {{ label }}
    </li>

    <li
      v-for="(item, i) in items"
      :key="i"
      class="list-row"
    >
      <div>
        <img class="size-10 rounded-box" :src="item.image" :alt="item.title">
      </div>
      <div>
        <div>{{ item.title }}</div>
        <div class="text-xs uppercase font-semibold opacity-60">
          {{ item.text }}
        </div>
      </div>
      <button
        v-for="(action, j) in item.actions"
        :key="j"
        class="btn btn-square btn-ghost"
        @click="action.onClick"
      >
        <component :is="action.icon" />
      </button>
    </li>
  </ul>
</template>

<script lang="ts" setup>
import type { ListItem } from '../types'

interface Props {
  label?: string
  items: Array<ListItem>
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
