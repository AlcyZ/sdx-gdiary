<template>
  <div class="flex items-center">
    <span
      class=""
      :class="labelClass"
    >{{ formatted }}</span>

    <IBtn
      square
      ghost
      size="sm"
      class="ml-1"
      @click="openPicker"
    >
      <IconEdit :size="20" />
    </IBtn>

    <input
      ref="input"
      v-model="model"
      type="datetime-local"
      class="absolute opacity-0 w-0 h-0"
    >
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import {
  Edit as IconEdit,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import IBtn from './IBtn.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const input = ref<HTMLInputElement | null>(null)

const model = defineModel<string | undefined>()

const notSelected = 'Nicht ausgewählt'
const formatted = computed(
  () => model.value === undefined || model.value === ''
    ? notSelected
    : dayjs(model.value).format('DD.MM.YYYY HH:mm'),
)

const labelClass = computed(() => [
    model.value === undefined ? 'opacity-60' : undefined
])

function openPicker() {
  console.info('sososo!')
  input.value?.showPicker()
  input.value?.focus()
}
</script>
