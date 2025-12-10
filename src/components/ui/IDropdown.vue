<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <slot />
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :class="dropdownContentClass"
      >
        <IDropdownMenu
          v-for="(item, i) in items"
          :key="i"
          :item="item"
          :item-class="itemClass"
          :dropdown-content-class="dropdownContentClass"
          @update:checked="$emit('update:checked', $event, i)"
          @update:selected="$emit('update:selected', $event, i)"
        />
        <DropdownMenuArrow class="fill-white" />
      </DropdownMenuContent>
    </DropdownMenuPortal>
  </DropdownMenuRoot>
</template>

<script lang="ts" setup>
import type { CheckboxCheckedState } from 'radix-vue'
import type { DropdownMenu } from '../../types'
import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue'
import { computed } from 'vue'
import IDropdownMenu from './IDropdownMenu.vue'

interface Props {
  items: Array<DropdownMenu>
  minW?: string
}
interface Emits {
  'update:checked': [value: CheckboxCheckedState, index: number]
  'update:selected': [value: string, index: number]
}

const { minW = 'min-w-48' } = defineProps<Props>()
defineEmits<Emits>()

const dropdownContentClass = computed(() => `bg-white p-3 shadow-lg rounded-box ${minW}`)

const itemClass = `
  flex items-center justify-between
  leading-none text-sm
  px-4 h-8
  transition-colors rounded-field
  hover:bg-neutral hover:text-neutral-content
  cursor-pointer
`
</script>
