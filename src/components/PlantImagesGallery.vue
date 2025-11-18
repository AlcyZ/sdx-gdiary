<template>
  <div class="grid" :class="gridClass">
    <PlantImageAsyncSquare
      v-for="(image, j) in images"
      :key="j"
      :image="image"
      :class="{ 'rounded-sm': hasGap }"
    />
  </div>
</template>

<script lang="ts" setup>
import type { PlantImage } from '../modules/plants/types'
import { computed } from 'vue'
import PlantImageAsyncSquare from './PlantImageAsyncSquare.vue'

export type Column = '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'

export type Gap = '0'
  | '0.5'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '3.5'
  | '4'
  | '5'

interface Props {
  images: Array<PlantImage>
  cols?: Column
  gap?: Gap | undefined
}
interface Emits {

}

const {
  cols = '3',
  gap = '0.5',
} = defineProps<Props>()
defineEmits<Emits>()

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
</script>
