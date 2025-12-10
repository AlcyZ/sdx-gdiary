<template>
  <DropdownMenuItem
    v-if="item.type === 'item'"
    :class="itemClass"
    class=""
  >
    {{ item.label }}
    <component :is="item.icon" v-bind="item.iconAttrs" />
  </DropdownMenuItem>

  <DropdownMenuSeparator
    v-else-if="item.type === 'separator'"
    class="bg-base-300 h-[1px] mx-4 my-2"
  />

  <DropdownMenuLabel
    v-else-if="item.type === 'label'"
    :class="itemClass"
    class="text-gray-500"
  >
    {{ item.label }}
  </DropdownMenuLabel>

  <DropdownMenuSub
    v-else-if="item.type === 'sub'"
  >
    <DropdownMenuSubTrigger
      :class="itemClass"
    >
      {{ item.label }}
      <component :is="item.icon" v-bind="item.iconAttrs" />
    </DropdownMenuSubTrigger>
    <DropdownMenuPortal>
      <DropdownMenuSubContent
        :class="dropdownContentClass"
      >
        <IDropdownMenu
          v-for="(subItem, i) in item.items"
          :key="i"
          :item="subItem"
          :item-class="itemClass"
          :dropdown-content-class="dropdownContentClass"
        />
      </DropdownMenuSubContent>
    </DropdownMenuPortal>
  </DropdownMenuSub>

  <DropdownMenuCheckboxItem
    v-else-if="item.type === 'checkbox'"
    :checked="item.checked"
    :class="itemClass"
    class="relative"
    @update:checked="$emit('update:checked', $event)"
  >
    <DropdownMenuItemIndicator
      class="absolute -left-1.5 inline-flex items-center justify-center"
    >
      <IconDot class="stroke-success" />
    </DropdownMenuItemIndicator>

    {{ item.label }}
  </DropdownMenuCheckboxItem>

  <DropdownMenuRadioGroup
    v-else-if="item.type === 'radio'"
    :model-value="item.selected"
    @update:model-value="asd"
  >
    <DropdownMenuRadioItem
      v-for="(radio, i) in item.items"
      :key="i"
      :class="itemClass"
      class="relative"
      :value="radio.value"
    >
      <DropdownMenuItemIndicator
        class="absolute -left-1.5 inline-flex items-center justify-center"
      >
        <IconDot class="stroke-success" />
      </DropdownMenuItemIndicator>

      {{ radio.label }}
    </DropdownMenuRadioItem>
  </DropdownMenuRadioGroup>
</template>

<script lang="ts" setup>
import type { CheckboxCheckedState } from 'radix-vue'
import type { DropdownMenu } from '../../types'
import {
  DotIcon as IconDot,
} from 'lucide-vue-next'
import { DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuItemIndicator, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from 'radix-vue'

interface Props {
  item: DropdownMenu
  itemClass: string
  dropdownContentClass: string
}
interface Emits {
  'update:checked': [value: CheckboxCheckedState]
  'update:selected': [value: string]
}

defineProps<Props>()
const emit = defineEmits<Emits>()

function asd(value: T) {
  emit('update:selected', value)
}
</script>
