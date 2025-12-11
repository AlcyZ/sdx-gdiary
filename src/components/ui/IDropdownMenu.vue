<template>
  <DropdownMenuItem
    v-if="item.type === 'item'"
    :class="itemClass"
    @click="item.onClick"
  >
    <template v-if="isLabeled(item)">
      {{ item.label }}
    </template>
    <component :is="item.content" v-else />
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
    <template v-if="isLabeled(item)">
      {{ item.label }}
    </template>
    <component :is="item.content" v-else />
  </DropdownMenuLabel>

  <DropdownMenuSub
    v-else-if="item.type === 'sub'"
  >
    <DropdownMenuSubTrigger
      :class="itemClass"
    >
      <template v-if="isLabeled(item)">
        {{ item.label }}
      </template>
      <component :is="item.content" v-else />
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

    <template v-if="isLabeled(item)">
      {{ item.label }}
    </template>
    <component :is="item.content" v-else />
  </DropdownMenuCheckboxItem>

  <DropdownMenuRadioGroup
    v-else-if="item.type === 'radio'"
    :model-value="item.selected"
    @update:model-value="handleSelected"
  >
    <DropdownMenuRadioItem
      v-for="(radio, i) in item.items"
      :key="i"
      :class="itemClass"
      class="relative"
      :value="radio.value"
    >
      <DropdownMenuItemIndicator
        class="absolute -left-1 inline-flex items-center justify-center"
      >
        <IconDot class="stroke-success" />
      </DropdownMenuItemIndicator>

      <template v-if="isLabeled(radio)">
        {{ radio.label }}
      </template>
      <component :is="radio.content" v-else />
    </DropdownMenuRadioItem>
  </DropdownMenuRadioGroup>
</template>

<script lang="ts" setup>
import type { CheckboxCheckedState } from 'radix-vue'
import type { DropdownMenu, HasContentOrLabel, HasLabelNoContent } from '../../types'
import {
  DotIcon as IconDot,
} from 'lucide-vue-next'
import { DropdownMenuCheckboxItem, DropdownMenuItem, DropdownMenuItemIndicator, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuRadioGroup, DropdownMenuRadioItem, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger } from 'radix-vue'
import { isHasLabelNoContent } from '../../guard.ts'

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

function handleSelected(value: string) {
  emit('update:selected', value)
}

function isLabeled(value: HasContentOrLabel): value is HasLabelNoContent {
  return isHasLabelNoContent(value)
}
</script>
