<template>
  <div class="py-6 flex justify-center items-center w-full">
    <IFab
      :actions="fabActions"
      class="mb-14"
      :icon="IconMenu"
    />

    <PlantPageOverview
      v-if="page === 'list'"
      :plants="plants"
      @show="showPlant"
      @edit="editPlant"
      @delete="showDeleteConfirmationModal"
    />
    <PlantPageShow
      v-else-if="page === 'show'"
      :plant="selected"
      @back="back"
    />
    <PlantPageAdd
      v-else-if="page === 'add'"
      @back="back"
      @back-and-sync="backAndSync"
    />
    <PlantPageEdit
      v-else-if="page === 'edit'"
      :plant="selected"
      @back="back"
    />
  </div>
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import type { FabAction } from '../types'
import {
  Leaf as IconList,
  Cog as IconMenu,
  CirclePlus as IconNew,
} from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import IFab from '../components/IFab.vue'
import PlantPageAdd from '../components/PlantPageAdd.vue'
import PlantPageEdit from '../components/PlantPageEdit.vue'
import PlantPageOverview from '../components/PlantPageOverview.vue'
import PlantPageShow from '../components/PlantPageShow.vue'
import { useModal } from '../composables/useModal.ts'
import { usePage } from '../composables/usePage.ts'
import { useToast } from '../composables/useToast.ts'
import PlantRepository from '../modules/plants/plant_repository.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { showConfirmationModal } = useModal()
const { showToast } = useToast()

type PlantPage = 'list' | 'add' | 'show' | 'edit'
const { page, changePage } = usePage<PlantPage>('list')

const plants = ref<Array<Plant>>([])
const selected = ref<Plant | null>(null)

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

async function syncPlants() {
  const repo = await PlantRepository.create()
  plants.value = await repo.getAll()
}

function showPlant(plant: Plant) {
  page.value = 'show'
  selected.value = plant
}

function editPlant(plant: Plant) {
  page.value = 'edit'
  selected.value = plant
}

async function showDeleteConfirmationModal(plant: Plant) {
  const plantName = plant.name !== ''
    ? `${plant.name} (${plant.strain})`
    : plant.strain
  const text = `Bist du sicher, dass die Pflanze '${plantName}' gelöscht werden soll? Diese Aktion kann nicht rückgängig gemacht werden.`

  const deleteAndSync = async () => {
    const repo = await PlantRepository.create()
    const result = await repo.delete(plant.id)

    if (result.ok) {
      showToast({
        message: `${plantName} ist gelöscht worden.`,
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

function back() {
  selected.value = null
  page.value = 'list'
}

async function backAndSync() {
  await syncPlants()
  page.value = 'list'
}

onMounted(syncPlants)
</script>
