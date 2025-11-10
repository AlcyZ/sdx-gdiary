<template>
  <ICard
    class="w-full max-w-3xl"
  >
    <IBtn
      variant="accent"
      class="w-full text-base-100"
      size="lg"
      @click="$router.push(`/plants/${plant.id}/log/watering`)"
    >
      <IconPlus />
      Neuer Gieß-Eintrag
    </IBtn>
  </ICard>
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import { Plus as IconPlus } from 'lucide-vue-next'
import IBtn from './ui/IBtn.vue'
import ICard from './ui/ICard.vue'

interface Props {
  plant: Plant
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
