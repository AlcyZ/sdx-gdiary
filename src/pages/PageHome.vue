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
import DevSeeder from '../seeder/devSeeder.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { showToast } = useToast()

async function seedPlants() {
  const count = 6
  const seeder = await DevSeeder.create()

  await seeder.seed(count)
  showToast({
    message: 'Seeder seed successfully!',
    variant: 'success',
    duration: 2000,
  })
}
</script>
