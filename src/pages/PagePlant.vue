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
    <PlantFormAdd
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
import PlantFormAdd from '../components/PlantFormAdd.vue'
import PlantList from '../components/PlantList.vue'
import { useModal } from '../composables/useModal.ts'
import {deletePlant, fetchPlants} from '../modules/plants'
import {useToast} from "../composables/useToast.ts";

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { showConfirmationModal } = useModal()
const { showToast } = useToast()

type PlantPage = 'list' | 'add' | 'edit'
const page = ref<PlantPage>('list')

const plants = ref<Array<Plant>>([])

const fabActions = ref<Array<FabAction>>([
  {
    icon: IconNew,
    onClick: () => changePage('add'),
  },
  {
    icon: IconList,
    onClick: () => changePage('list'),
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

async function removePlant(plant: Plant) {
  const name = plant.name !== ''
    ? `${plant.name} (${plant.strain})`
    : plant.strain
  const text = `Bist du sicher, dass die Pflanze '${name}' gelöscht werden soll? Diese Aktion kann nicht rückgängig gemacht werden.`

  const deleteAndSync = async () => {
    const result = await deletePlant(plant.id)
    if (result.ok) {
      showToast({
        message: 'Löschen hat geklappt!',
        duration: 2000,
        variant: 'success',
      })
      await syncPlants()
      return
    }

    showToast({
      message: result.error,
      duration: 2000,
      variant: 'error',
    })
  }

  showConfirmationModal({
    title: 'Pflanze löschen',
    text,
    actions: [{
      label: 'Löschen',
      onClick: async () => await deleteAndSync(),
      class: 'btn-error text-base-100',
    }],
  })
}

onMounted(syncPlants)
</script>
