<template>
  <ICard
    class="w-full max-w-2xl"
  >
    add pour

    <template #actions>
      <IBtn
        @click="$emit('back')"
      >
        <IconBack />
        Back
      </IBtn>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import {
  MoveLeft as IconBack,
} from 'lucide-vue-next'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'

interface Props {

}
interface Emits {
  back: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>
