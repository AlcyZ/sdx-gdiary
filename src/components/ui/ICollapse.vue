<template>
  <div>
    <slot name="title" />

    <AnimatePresence :initial="false">
      <motion.div
        v-if="open"
        v-bind="contentAttributes"
        :variants
        initial="close"
        animate="open"
        exit="close"
        class="overflow-hidden"
      >
        <slot />
      </motion.div>
    </AnimatePresence>
  </div>
</template>

<script lang="ts" setup>
import type { MotionProps } from 'motion-v'
import { AnimatePresence, motion } from 'motion-v'
import { computed } from 'vue'

interface Props {
  open: boolean
  duration?: number
  opacityOffset?: number
  contentAttributes?: Record<string, unknown>
}
interface Emits {

}

const { duration = 0.2, opacityOffset = 0.2 } = defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  default: (props: Record<string, never>) => any
  title: (props: Record<string, never>) => any
}>()

const sanitizedOffset = computed(() => Math.min(Math.max(opacityOffset, 0), 1))
const durationOpacity = computed(() => duration * (1 + sanitizedOffset.value))

const variants: MotionProps['variants'] = {
  open: {
    height: 'auto',
    opacity: 1,
    transition: {
      height: {
        duration,
        ease: 'easeInOut',
      },
      opacity: {
        duration: durationOpacity.value,
        ease: 'easeInOut',
      },
    },
  },
  close: {
    height: 0,
    opacity: 0,
    transition: {
      height: {
        duration,
        ease: 'easeInOut',
      },
      opacity: {
        duration: durationOpacity.value,
        ease: 'easeInOut',
      },
    },
  },
}
</script>
