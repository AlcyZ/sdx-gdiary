<template>
  <IEmptyState
    title="Füge deine erste Pflanze hinzu"
    :title-icon="IconFlower"
    :description="description"
    :illustration="IllustrationWateringPlants"
    cta="Neue Pflanze hinzufügen"
    :cta-icon="IconPlus"
  >
    <template #bonus>
      <div class="text-center mt-2">
        <RouterLink
          :to="{ name: 'settings' }"
          class="text-xs text-gray-500"
        >
          Aus Backup wiederherstellen
        </RouterLink>
      </div>
    </template>
  </IEmptyState>
</template>

<script lang="ts" setup>
import {
  Flower as IconFlower,
  Plus as IconPlus,
} from 'lucide-vue-next'
import IllustrationWateringPlants from '../illustrations/IllustrationWateringPlants.vue'
import IEmptyState from './ui/IEmptyState.vue'

interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const description = 'Es sieht so aus, als hättest du noch keine Pflanzen erfasst. Füge jetzt eine hinzu, um deren Pflege zu starten und keinen Gießtermin mehr zu verpassen.'
</script>
