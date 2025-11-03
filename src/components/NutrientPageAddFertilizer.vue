<template>
  <ICard
    class="w-full max-w-2xl"
    class-actions="justify-between"
  >
    <ICardTitle class="text-3xl">
      Neuen Dünger anlegen
    </ICardTitle>

    <div class="my-5">
      <InputFertilizer
        v-model="fert"
      />
    </div>

    <template #actions>
      <IBtn
        @click="$emit('back')"
      >
        <IconBack />
        Zurück
      </IBtn>
      <div class="join">
        <IBtn
          variant="primary"
          class="join-item text-base-100"
          @click="$emit('back')"
        >
          <IconSave />
          Speichern
        </IBtn>
        <IBtn
          variant="neutral"
          class="join-item"
          @click="$emit('back')"
        >
          <IconAdd />
          Speichern & Neu
        </IBtn>
      </div>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import {
  CirclePlus as IconAdd,
  MoveLeft as IconBack,
  Save as IconSave,
} from 'lucide-vue-next'
import { ref } from 'vue'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import ICardTitle from './ICardTitle.vue'
import InputFertilizer from './InputFertilizer.vue'

interface Props {

}
interface Emits {
  back: []
}

defineProps<Props>()
defineEmits<Emits>()

const fert = ref<NewFertilizer>({ name: '', manufacturer: undefined })
</script>
