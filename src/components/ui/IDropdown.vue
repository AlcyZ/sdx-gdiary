<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger @click.stop>
      <slot v-if="!!$slots.default" />
      <IBtn
        v-else
        square
        ghost
        role="button"
        :class="btnClass"
      >
        <IconMore />
      </IBtn>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
      <DropdownMenuContent
        :side="side"
        :align="align"
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
  EllipsisVertical as IconMore,
} from 'lucide-vue-next'
import {
  DropdownMenuArrow,
  DropdownMenuContent,
  DropdownMenuPortal,
  DropdownMenuRoot,
  DropdownMenuTrigger,
} from 'radix-vue'
import { computed } from 'vue'
import IBtn from './IBtn.vue'
import IDropdownMenu from './IDropdownMenu.vue'

interface Props {
  items: Array<DropdownMenu>
  minW?: string
  btnClass?: string
  side?: 'left' | 'right'
  align?: 'start' | 'center' | 'end'
}
interface Emits {
  'update:checked': [value: CheckboxCheckedState, index: number]
  'update:selected': [value: string, index: number]
}

const { minW = 'min-w-40', items } = defineProps<Props>()
defineEmits<Emits>()

const dropdownContentClass = computed(() => `bg-white p-3 shadow-lg rounded-box ${minW}`)

const hasCheckbox = computed((): boolean => items.some(i => i.type === 'checkbox'))
const hasRadio = computed((): boolean => items.some(i => i.type === 'radio'))

const itemClass = computed(() => `
  flex items-center gap-x-2
  leading-none text-sm
  transition-colors rounded-field
  hover:bg-neutral hover:text-neutral-content
  cursor-pointer
  h-9 py-1.5
  ${hasCheckbox.value || hasRadio.value
      ? 'pl-4 pr-2'
      : 'px-2'
  }
`)
</script>
