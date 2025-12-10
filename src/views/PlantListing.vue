<template>
  <LayoutDock>
    <div class="w-full flex flex-col items-center gap-y-5 p-4" :class="{ 'flex-1 justify-center': !plantStore.hasPlants }">
      <template v-if="plantStore.hasPlants">
        <header class="w-full max-w-3xl flex items-center justify-between">
          <h1 class="text-4xl font-extrabold">
            Pflanzen
          </h1>

          <IDropdown
            :items="dropdown"
            @update:selected="handleSelectedFilter"
          >
            <IBtn
              circle
              ghost
              size="lg"
            >
              <IconFilter :size="20" />
            </IBtn>
          </IDropdown>
        </header>

        <PlantListingCard
          :config="configStore.plantListingConfiguration"
        />
      </template>

      <PlantListingEmpty
        v-else
      />

      <IFab
        :actions="fabActions"
        class="mb-14"
        :icon="IconMenu"
      />
    </div>
  </LayoutDock>
</template>

<script lang="ts" setup>
import type { DropdownMenu } from '../types'
import {
  Funnel as IconFilter,
  Cog as IconMenu,
} from 'lucide-vue-next'
import { computed, shallowRef } from 'vue'
import PlantListingCard from '../components/PlantListingCard.vue'
import PlantListingEmpty from '../components/PlantListingEmpty.vue'
import IBtn from '../components/ui/IBtn.vue'
import IDropdown from '../components/ui/IDropdown.vue'
import IFab from '../components/ui/IFab.vue'
import { usePlantView } from '../composables/usePlantView.ts'
import LayoutDock from '../layouts/LayoutDock.vue'
import { isPlantListingFilter } from '../modules/configuration/guard.ts'
import { useConfigurationStore } from '../stores/configurationStore.ts'
import { usePlantStore } from '../stores/plantStore.ts'

interface Props {
}
interface Emits {
}

defineProps<Props>()
defineEmits<Emits>()

const { fabActions } = usePlantView()

const plantStore = usePlantStore()
const configStore = useConfigurationStore()

const dropdown = computed((): Array<DropdownMenu> => [
  {
    type: 'radio',
    selected: configStore.plantListingConfiguration.filter,
    items: [
      {
        label: 'Alle anzeigen',
        value: 'show-all',
      },
      {
        label: 'Geerntete verbergen',
        value: 'hide-harvested',
      },
    ],
  },
])

function handleSelectedFilter(filter: string) {
  if (isPlantListingFilter(filter)) {
    configStore.savePlantListingConfiguration({ filter })
  }
}
</script>
