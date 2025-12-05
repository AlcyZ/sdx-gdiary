<template>
  <LayoutForm>
    <template #top-navigation>
      <TopNavigation
        @back="$router.back()"
      />
    </template>

    <div class="flex justify-center py-4">
      <PlantHarvestSession
        v-if="plantStore.plant"
        :plant="plantStore.plant"
      />
      <NotFound
        v-else
      />
    </div>
  </LayoutForm>
</template>

<script lang="ts" setup>
import { onMounted } from 'vue'
import TopNavigation from '../components/layout/TopNavigation.vue'
import PlantHarvestSession from '../components/PlantHarvestSession.vue'
import LayoutForm from '../layouts/LayoutForm.vue'
import { usePlantStore } from '../stores/plantStore.ts'
import NotFound from './NotFound.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()

onMounted(async () => await plantStore.syncPlantWithRoute())
</script>
