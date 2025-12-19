<template>
  <ICard class="w-full">
    <motion.ul
      class="space-y-6"
      :variants="fadeLeft.list"
      initial="from"
      while-in-view="to"
    >
      <motion.li
        v-for="(group, i) in groups"
        :key="i"
        :variants="fadeLeft.item"
      >
        <ICollapseLegacy
          name="fertilizer"
          arrow
          closable
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
        </ICollapseLegacy>
      </motion.li>
    </motion.ul>
  </ICard>
</template>

<script lang="ts" setup generic="T, P">
import { motion } from 'motion-v'
import useStaggerAnimation from '../composables/useStaggerAnimation.ts'
import ICard from './ui/ICard.vue'
import ICollapseLegacy from './ui/ICollapseLegacy.vue'
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

const { fadeLeft } = useStaggerAnimation({
  to: {
    startDelay: 0.5,
  },
})
</script>
