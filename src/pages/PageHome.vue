<template>
  <div>
    Home

    <button class="btn" @click="syncPlants">
      Dev
    </button>

    <PlantList
      :plants="plants"
      @delete="removePlant"
    />
  </div>
</template>

<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import PlantList from '../components/PlantList.vue'
import { deletePlant, fetchPlants } from '../modules/plants'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const plants = ref<Array<Plant>>([])

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
