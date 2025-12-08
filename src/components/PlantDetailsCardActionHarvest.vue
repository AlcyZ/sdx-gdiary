<template>
  <ICard
    class="w-full max-w-3xl"
  >
    <IBtn
      variant="accent"
      class="w-full"
      size="lg"
      soft
      @click="$router.push({
        name: ROUTE_PLANT_HARVEST,
        params: { plantId: plant.id },
      })"
    >
      <IconPlus />
      Ernte starten
    </IBtn>
  </ICard>
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import { Plus as IconPlus } from 'lucide-vue-next'
import { ROUTE_PLANT_HARVEST } from '../routes.ts'
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
