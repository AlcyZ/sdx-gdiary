<template>
  <div class="dropdown">
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
import type { DropdownItem } from '../../types'
import {
  EllipsisVertical as IconMore,
} from 'lucide-vue-next'
import IBtn from './IBtn.vue'

interface Props {
  items: Array<DropdownItem>
  btnClass?: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  btn: (props: Record<never, string>) => any
}>()
</script>
