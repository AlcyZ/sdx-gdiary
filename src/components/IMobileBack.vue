<template>
  <IBtn
    ghost
    size="lg"
    class="fixed top-5 left-0 z-50 block sm:hidden"
    @click="$emit('back')"
  >
    <ChevronLeft :size="32" />
  </IBtn>
</template>

<script lang="ts" setup>
import { ChevronLeft } from 'lucide-vue-next'
import IBtn from './IBtn.vue'

interface Props {

}
interface Emits {
  back: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>
