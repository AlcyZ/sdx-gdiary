<template>
  <ICard class="w-full">
    <ICollapse
      v-for="(group, i) in groups"
      :key="i"
      name="fertilizer"
      arrow
      closable
      class="my-2"
    >
      <ICollapseTitle
        class="text-lg font-bold bg-gray-50 border-b border-b-gray-100"
      >
        {{ group.title }}
      </ICollapseTitle>

      <ICollapseContent>
        <div
          v-for="(item, j) in group.items"
          :key="j"
          class="flex items-center justify-between border-b py-3 border-b-gray-100"
          :class="{
            'border-b-3': j === (group.items.length - 1),
          }"
        >
          <slot name="item" :item="item" />
        </div>
      </ICollapseContent>
    </ICollapse>
  </ICard>
</template>

<script lang="ts" setup generic="T">
import {
  Trash as IconDelete,
  Edit as IconEdit,
} from 'lucide-vue-next'
import ICard from './ui/ICard.vue'
import ICollapse from './ui/ICollapse.vue'
import ICollapseContent from './ui/ICollapseContent.vue'
import ICollapseTitle from './ui/ICollapseTitle.vue'

interface NutrientsOverviewGroupItem {
  title: string
  items: Array<T>
}

interface Props {
  groups: Array<NutrientsOverviewGroupItem>
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  item: (props: { item: T }) => any
}>()
</script>
