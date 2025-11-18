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
        class="text-lg font-bold bg-gray-50 border-b border-b-gray-100 flex items-center justify-between"
      >
        {{ group.title }}

        <slot v-if="!!$slots['header-actions']" name="header-actions" :payload="group.payload" />
      </ICollapseTitle>

      <ICollapseContent
        :class="collapseContentClass"
      >
        <div
          v-for="(item, j) in group.items"
          :key="j"
          class="border-b py-3 border-b-gray-100"
          :class="{
            'border-b-3': j === (group.items.length - 1),
            [slotContainerClass || '']: true,
          }"
        >
          <slot name="item" :item="item" :payload="group.payload" :index="j" :length="group.items.length" />
        </div>
      </ICollapseContent>
    </ICollapse>
  </ICard>
</template>

<script lang="ts" setup generic="T, P">
import ICard from './ui/ICard.vue'
import ICollapse from './ui/ICollapse.vue'
import ICollapseContent from './ui/ICollapseContent.vue'
import ICollapseTitle from './ui/ICollapseTitle.vue'

interface NutrientsOverviewGroupItem {
  title: string
  payload?: P
  items: Array<T>
}

interface Props {
  groups: Array<NutrientsOverviewGroupItem>
  collapseContentClass?: string
  slotContainerClass?: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  'header-actions': (props: { payload: P | undefined }) => any
  'item': (props: { item: T, payload: P | undefined, index: number, length: number }) => any
}>()
</script>
