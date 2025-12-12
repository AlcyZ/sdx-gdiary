<template>
  <PopoverRoot>
    <PopoverTrigger
      class="btn btn-square btn-ghost btn-lg"
      :class="triggerClass"
    >
      <slot name="trigger" />
    </PopoverTrigger>
    <PopoverPortal>
      <PopoverContent
        :side="side"
        :side-offset="sideOffset"
        class="bg-white border border-gray-50 rounded-field shadow-lg w-72 relative"
      >
        <div class="pr-14">
          <slot />
        </div>
        <PopoverClose
          aria-label="Close"
          class="absolute top-1.5 right-1.5 btn btn-square btn-ghost btn-lg"
        >
          <IconX />
        </PopoverClose>
        <PopoverArrow class="fill-white" />
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>

<script lang="ts" setup>
import {
  X as IconX,
} from 'lucide-vue-next'
import { PopoverArrow, PopoverClose, PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'radix-vue'

interface Props {
  side?: 'top' | 'right' | 'bottom' | 'left' | undefined
  sideOffset?: number
  triggerClass?: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  default: (props: Record<string, never>) => any
  trigger: (props: Record<string, never>) => any
}>()
</script>
