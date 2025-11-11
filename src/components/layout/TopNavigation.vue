<template>
  <div class="bg-[#16a34a] flex items-center justify-between">
    <IBtn
      ghost
      square
      variant="neutral"
      class="rounded-none text-base-100"
      @click="$emit('back')"
    >
      <IconBack />
    </IBtn>

    <span
      v-if="title"
      class="text-base-100 font-semibold absolute left-1/2 -translate-x-1/2"
    >{{ title }}</span>

    <IDropdown
      v-if="actions"
      :items="actions"
      btn-class="rounded-none text-base-100"
      position="end"
    />
  </div>
</template>

<script lang="ts" setup>
import type { TopNavigationAction } from '../../types'
import {
  ChevronLeft as IconBack,
} from 'lucide-vue-next'
import IBtn from '../ui/IBtn.vue'
import IDropdown from '../ui/IDropdown.vue'

interface Props {
  title?: string
  actions?: Array<TopNavigationAction>
}
interface Emits {
  back: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>
