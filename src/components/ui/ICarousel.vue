<template>
  <div class="carousel" :class="carouselClass">
    <slot />
  </div>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  position?: CarouselPosition | undefined
  vertical?: boolean
}
interface Emits {

}

type CarouselPosition = 'start' | 'center' | 'end'

const { position, vertical = false } = defineProps<Props>()
defineEmits<Emits>()

const carouselPositionMap: Record<CarouselPosition, string> = {
  start: 'carousel-start',
  center: 'carousel-center',
  end: 'carousel-end',
}

const carouselClass = computed(() => [
  position ? carouselPositionMap[position] : undefined,
  vertical ? 'carousel-vertical' : 'carousel-horizontal',
])
</script>
