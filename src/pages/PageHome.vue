<template>
  <div>
    Home

    <button class="btn" @click="dev">
      Dev
    </button>

    <PlantList
      :plants="plants"
    />
  </div>
</template>

<script lang="ts" setup>
import {onMounted, ref} from 'vue'
import PlantList from '../components/PlantList.vue'
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

onMounted(dev)
</script>
