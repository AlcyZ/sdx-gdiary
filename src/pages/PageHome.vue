<template>
  <div>
    --- Home ---

    <div>
      <button class="btn btn-warning" @click="seedPlants">
        Pflanzen Seeden
      </button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import PlantSeeder from '../seeder/plantSeeder.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

async function seedPlants() {
  const count = 15
  const seeder = PlantSeeder.create()

  for (let i = 0; i < count; i++) {
    const result = await seeder.seed()
  }
}
</script>
