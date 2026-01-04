<template>
  <div class="h-full flex items-center p-4">
    <component
      :is="plantListingEmpty"
      :variants="fadeUp"
      initial="from"
      animate="to"
    />
  </div>
</template>

<script lang="ts" setup>
import { motion } from 'motion-v'
import { useContentAnimation } from '../composables/useContentAnimation.ts'
import PlantListingEmpty from './PlantListingEmpty.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const plantListingEmpty = motion.create(PlantListingEmpty)

const { fadeUp } = useContentAnimation()
</script>
