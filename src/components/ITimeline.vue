<template>
  <ul class="timeline" :class="timelineClass">
    <template v-if="items !== undefined && items.length > 0 && !!$slots.item">
      <slot
        v-for="(item, i) in items"
        :key="i"
        name="item"
        :item="item"
      />
    </template>
    <template v-else>
      <slot />
    </template>
  </ul>
</template>

<script lang="ts" setup generic="T">
import { computed } from 'vue'

interface Props {
  vertical?: boolean
  items?: Array<T>
}

interface Emits {

}

const { vertical } = defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  default: (props: Record<string, never>) => any
  item: (props: { item: T, key: number }) => any
}>()

const timelineClass = computed(() => vertical ? 'timeline-vertical' : undefined)
</script>
