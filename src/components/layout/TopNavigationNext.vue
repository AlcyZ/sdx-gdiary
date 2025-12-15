<template>
  <div class="bg-[#16a34a] flex items-center justify-between h-12">
    <IBtn
      ghost
      square
      variant="neutral"
      class="rounded-none text-base-100 w-12 h-12"
      @click="handleBack"
    >
      <IconChevronLeft class="fill-base-100" />
    </IBtn>

    <span
      v-if="props.title"
      class="text-base-100 font-semibold absolute left-1/2 -translate-x-1/2"
    >{{ props.title }}</span>

    <IDropdown
      v-if="props.actions"
      :items="props.actions"
      btn-class="rounded-none text-base-100 w-12 h-12"
      class="dropdown-end"
    />
  </div>
</template>

<script lang="ts" setup>
import type { TopNavigationProps } from '../../types'
import { useRouter } from 'vue-router'
import IconChevronLeft from '../../icons/IconChevronLeft.vue'
import IBtn from '../ui/IBtn.vue'
import IDropdown from '../ui/IDropdown.vue'

interface Props {
  props: TopNavigationProps
}
interface Emits {
  back: []
}

const { props } = defineProps<Props>()
defineEmits<Emits>()

const router = useRouter()

function handleBack() {
  if (props.back) {
    props.back()
  }
  else {
    router.back()
  }
}
</script>
