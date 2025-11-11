<template>
  <div class="dropdown" :class="dropdownClass">
    <IBtn
      square
      ghost
      tabindex="0"
      role="button"
      class="m1"
      :class="btnClass"
    >
      <slot v-if="!!$slots.btn" name="btn" />
      <IconMore v-else />
    </IBtn>
    <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-40 p-2 shadow-sm">
      <li
        v-for="(item, i) in items"
        :key="i"
      >
        <button
          type="button"
          role="button"
          @click="item.onClick"
        >
          <component :is="item.icon" />
          {{ item.label }}
        </button>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import type { DropdownItem, DropdownPosition } from '../../types'
import {
  EllipsisVertical as IconMore,
} from 'lucide-vue-next'
import { computed } from 'vue'
import IBtn from './IBtn.vue'

interface Props {
  items: Array<DropdownItem>
  btnClass?: string
  position?: DropdownPosition | undefined
  positionSm?: DropdownPosition | undefined
  positionMd?: DropdownPosition | undefined
  positionLg?: DropdownPosition | undefined
  positionXl?: DropdownPosition | undefined
}
interface Emits {

}

const {
  position,
  positionSm,
  positionMd,
  positionLg,
  positionXl,
} = defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  btn: (props: Record<never, string>) => any
}>()

const positionMap: Record<DropdownPosition, string> = {
  start: 'dropdown-start',
  center: 'dropdown-center',
  end: 'dropdown-end',
  top: 'dropdown-top',
  bottom: 'dropdown-bottom',
  left: 'dropdown-left',
  right: 'dropdown-right',
}

function toResponsive(pos?: DropdownPosition, responsive?: 'sm' | 'md' | 'lg' | 'xl'): string | undefined {
  if (!pos)
    return undefined

  return responsive !== undefined
    ? `${responsive}:${positionMap[pos]}`
    : positionMap[pos]
}

const dropdownClass = computed(() => [
  toResponsive(position),
  toResponsive(positionSm, 'sm'),
  toResponsive(positionMd, 'md'),
  toResponsive(positionLg, 'lg'),
  toResponsive(positionXl, 'xl'),
])
</script>
