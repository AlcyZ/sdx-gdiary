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
import { useToast } from '../composables/useToast.ts'
import PlantSeeder from '../seeder/plantSeeder.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { showToast } = useToast()

async function seedPlants() {
  const count = 5
  const seeder = PlantSeeder.create()

  for (let i = 0; i < count; i++) {
    const result = await seeder.seed()
    if (result.ok) {
      showToast({
        message: `${count} Pflanzen erstellt`,
        variant: 'success',
        duration: 5,
      })
    }
  }
}
</script>
