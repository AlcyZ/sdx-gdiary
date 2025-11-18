<template>
  <div class="shadow-sm">
    <h3 class="text-lg font-semibold flex items-center h-20 px-2 py-8 underline underline-offset-2 decoration-base border-b border-b-base-200">
      <slot name="title" />
    </h3>

    <div
      v-for="(item, i) in items"
      :key="i"
      class="flex items-center justify-between cursor-pointer border-b border-b-base-200 h-16 px-2 py-8 transition-colors hover:bg-base-200 active:bg-base-200"
      :class="{ 'border-b-0': i === items.length - 1 }"
      @click="$emit('clicked', item)"
    >
      <div class="flex-1">
        <slot name="item" :item="item" />
      </div>

      <IconPlus />
    </div>
  </div>
</template>

<script lang="ts" setup generic="T">
import {
  ArrowRight as IconPlus,
} from 'lucide-vue-next'

interface Props {
  items: Array<T>
}
interface Emits {
  clicked: [item: T]
}

defineProps<Props>()
defineEmits<Emits>()

defineSlots<{
  title: (props: Record<string, never>) => any
  item: (props: { item: T }) => any
}>()
</script>
