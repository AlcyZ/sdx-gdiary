<template>
  <ICard
    v-if="!plant.isHarvested"
    class="w-full max-w-3xl"
  >
    <IBtn
      variant="accent"
      class="w-full"
      size="lg"
      soft
      @click="navigateToHarvestForm"
    >
      <IconPlus />
      {{ label }}
    </IBtn>
  </ICard>
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import { Plus as IconPlus } from 'lucide-vue-next'
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { ROUTE_PLANT_HARVEST } from '../routes.ts'
import IBtn from './ui/IBtn.vue'
import ICard from './ui/ICard.vue'

interface Props {
  plant: Plant
}
interface Emits {

}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const router = useRouter()

const label = computed(() =>
  plant.isHarvesting
    ? 'Ernte fortsetzen'
    : 'Ernte starten',
)

function navigateToHarvestForm() {
  router.push({
    name: ROUTE_PLANT_HARVEST,
    params: { plantId: plant.id },
  })
}
</script>
