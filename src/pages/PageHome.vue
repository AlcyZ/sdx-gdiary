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
  const count = 5
  const seeder = await DevSeeder.create()

  await seeder.seed()

  console.info('done?')
}
</script>
