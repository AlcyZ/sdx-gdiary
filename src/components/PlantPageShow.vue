<template>
  <ICard
    v-if="plant !== null"
    class="w-full max-w-xl"
  >
    <h1 class="text-3xl font-bold text-center">
      {{ plantName }}
    </h1>

    <div class="my-3">
      asd show plant ü
    </div>

    <div class="card-actions">
      <button
        class="btn btn-ghost"
        @click="$emit('back')"
      >
        <IconBack />
      </button>

      <IDropdown
        :items="actions"
      />
    </div>
  </ICard>
  <PlantPageSelectionError
    v-else
    @back="$emit('back')"
  />
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import type { DropdownItem } from '../types'
import {
  MoveLeft as IconBack,
  Camera as IconCamera,
  Cog as IconCog,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import ICard from './ICard.vue'
import IDropdown from './IDropdown.vue'
import PlantPageSelectionError from './PlantPageSelectionError.vue'

interface Props {
  plant: Plant | null
}
interface Emits {
  back: []
}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const plantName = computed(() => plant?.name !== undefined ? `${plant.name} (${plant.strain})` : plant?.strain || 'Unknown')

const actions = ref<Array<DropdownItem>>([
  {
    label: 'Einstellungen',
    onClick: () => console.log('Set'),
    icon: IconCog,
  },
  {
    label: 'Bild',
    onClick: () => console.log('Cam'),
    icon: IconCamera,
  },
])
</script>
