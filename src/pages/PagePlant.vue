<template>
  <div class="py-6">
    <IFab
      :actions="fabActions"
      class="mb-14"
      :icon="IconMenu"
    />

    <PlantList
      v-if="page === 'list'"
      :plants="plants"
      @delete="removePlant"
    />
    <PlantFormNew
      v-else-if="page === 'add'"
      @back="page = 'list'"
    />
  </div>
</template>

<script lang="ts" setup>
import type { FabAction } from '../types'
import {
  Leaf as IconList,
  Cog as IconMenu,
  CirclePlus as IconNew,
} from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import IFab from '../components/IFab.vue'
import PlantFormNew from '../components/PlantFormNew.vue'
import PlantList from '../components/PlantList.vue'
import { deletePlant, fetchPlants } from '../modules/plants'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

type PlantPage = 'list' | 'add' | 'edit'
const page = ref<PlantPage>('add')

const plants = ref<Array<Plant>>([])

const fabActions = ref<Array<FabAction>>([
  {
    icon: IconList,
    onClick: () => changePage('list'),
  },
  {
    icon: IconNew,
    onClick: () => changePage('add'),
  },
])

function changePage(newPage: PlantPage) {
  page.value = newPage
}

async function syncPlants() {
  const result = await fetchPlants()

  if (result.ok)
    plants.value = result.value
}

async function removePlant(plantId: number) {
  await deletePlant(plantId)
  await syncPlants()
}

onMounted(syncPlants)
</script>
