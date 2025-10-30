<template>
  <div>
    Home

    <button class="btn" @click="dev">
      Dev
    </button>

    <div class="border">
      <div v-for="(plant, i) in plants" :key="i">
        {{ plant.strain }}
        <br>
        <img :src="plant.image" :alt="plant.strain" />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import { getDb, TABLE_PLANT_IMAGES } from '../modules/db'
import { fetchPlants } from '../modules/plants'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const plants = ref<Array<Plant>>([])

async function dev() {
  const result = await fetchPlants()

  if (result.ok)
    plants.value = result.value
}
</script>
