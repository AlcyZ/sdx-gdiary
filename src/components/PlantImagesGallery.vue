<template>
  <AnimatePresence>
    <motion.div
      v-if="show"
      class="mt-4 overflow-hidden"
      style="transition: height 0.3s ease-in-out"
      :variants="list"
      initial="close"
      animate="open"
      exit="close"
    >
      <VueDraggable
        :model-value="images"
        item-key="plantImages"
        class="grid"
        :class="gridClass"
        group="plantImages"
        @change="handleChange"
      >
        <template #item="{ element: image }">
          <component
            :is="imageComponent"
            :image="image"
            :class="{ 'rounded-sm': hasGap }"
            :variants="item"
          />
        </template>
      </VueDraggable>
    </motion.div>
  </AnimatePresence>
</template>

<script lang="ts" setup>
import type { MotionProps } from 'motion-v'
import type { ChangeEvent, Column, Gap } from '../modules/gallery/types'
import type { PlantImage } from '../modules/plants/types'
import { AnimatePresence, motion, stagger } from 'motion-v'
import { computed, onMounted, ref } from 'vue'
import VueDraggable from 'vuedraggable'
import PlantImageAsyncSquare from './PlantImageAsyncSquare.vue'

interface Props {
  plantId: number
  images: Array<PlantImage>
  show: boolean
  cols?: Column
  gap?: Gap | undefined
}
interface Emits {
  change: [event: ChangeEvent, plantId: number]
}

const {
  cols = '3',
  gap = '0.5',
  plantId,
} = defineProps<Props>()
const emit = defineEmits<Emits>()

const imageComponent = motion.create(PlantImageAsyncSquare)

const delayAnimation = ref(true)
const list = computed((): MotionProps['variants'] => ({
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: { duration: 0.25, ease: 'easeInOut' },
      delayChildren: stagger(0.1, { startDelay: delayAnimation.value ? 0.5 : undefined }),
    },
  },
  close: {
    height: 0,
    opacity: 0,
    transition: {
      height: { duration: 0.1, ease: 'easeInOut' },
      when: 'afterChildren',
      delayChildren: stagger(0.1, { from: 'last' }),
    },
  },
}))

const item: MotionProps['variants'] = {
  open: {
    opacity: 1,
    x: 0,
  },
  close: {
    opacity: 0,
    x: -100,
  },
}

onMounted(() => {
  setTimeout(() => delayAnimation.value = false, 500)
})

const gridClass = computed(() => [
  getCol(cols),
  getGap(gap),
])

const hasGap = computed(() => gap !== '0' && gap !== undefined)

function getCol(value: Column): string | undefined {
  if (value === undefined)
    return undefined

  const key = String(value)

  switch (key) {
    case '1':
      return 'grid-cols-1'
    case '2':
      return 'grid-cols-2'
    case '3':
      return 'grid-cols-3'
    case '4':
      return 'grid-cols-4'
    case '5':
      return 'grid-cols-5'
    case '6':
      return 'grid-cols-6'
    default:
      return undefined
  }
}

function getGap(value?: Gap): string | undefined {
  if (value === undefined)
    return undefined

  const key = String(value)

  switch (key) {
    case '0.5':
      return 'gap-0.5'
    case '1':
      return 'gap-1'
    case '1.5':
      return 'gap-1.5'
    case '2':
      return 'gap-2'
    case '2.5':
      return 'gap-2.5'
    case '3':
      return 'gap-3'
    case '3.5':
      return 'gap-3.5'
    case '4':
      return 'gap-4'
    case '5':
      return 'gap-5'
    default:
      return undefined
  }
}

function handleChange(event: ChangeEvent) {
  emit('change', event, plantId)
}
</script>

<style>
/* Die Transition-Klassen von Vue */
.expand-enter-active,
.expand-leave-active {
  transition: all 0.5s ease-in-out;
  overflow: hidden; /* Wichtig, damit nichts übersteht */
}

.expand-enter-from,
.expand-leave-to {
  max-height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  /* Wähle einen Wert, der sicher größer ist als dein Inhalt jemals wird */
  max-height: 1000px;
  opacity: 1;
}
</style>
