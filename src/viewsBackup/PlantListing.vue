<template>
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

      <PlantListingCard />
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
</template>

<script lang="ts" setup>
import type { DropdownMenu } from '../types'
import {
  Funnel as IconFilter,
  Cog as IconMenu,
} from 'lucide-vue-next'
import { computed } from 'vue'
import PlantListingCard from '../componentsBackup/PlantListingCard.vue'
import PlantListingEmpty from '../componentsBackup/PlantListingEmpty.vue'
import IBtn from '../componentsBackup/ui/IBtn.vue'
import IDropdown from '../componentsBackup/ui/IDropdown.vue'
import IFab from '../componentsBackup/ui/IFab.vue'
import { usePlantView } from '../composables/usePlantView.ts'
import { useToast } from '../composables/useToast.ts'
import { isPlantListingFilter, isPlantListingSort } from '../modules/configuration/guard.ts'
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
const { toast } = useToast()

const dropdown = computed((): Array<DropdownMenu> => [
  {
    type: 'label',
    label: 'Filter:',
  },
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
  {
    type: 'separator',
  },
  {
    type: 'label',
    label: 'Sortierreihenfolge',
  },
  {
    type: 'radio',
    selected: configStore.plantListingConfiguration.sort,
    items: [
      {
        label: 'Standard (Zuerst angelegt)',
        value: 'default',
      },
      {
        label: 'Zuletzt angelegt',
        value: 'created-desc',
      },
      {
        label: 'Gepflanzt aufsteigend',
        value: 'planted-asc',
      },
      {
        label: 'Gepflanzt absteigend',
        value: 'planted-desc',
      },
    ],
  },
])

function handleSelectedFilter(value: string) {
  if (isPlantListingFilter(value)) {
    const result = configStore.savePlantListingConfiguration({
      filter: value,
      sort: configStore.plantListingConfiguration.sort,
    })

    result.ok
      ? toast('Filter gespeichert', 'success')
      : toast('Es ist ein Fehler beim Speichern des Filters aufgetreten', 'error')
  }

  else if (isPlantListingSort(value)) {
    const result = configStore.savePlantListingConfiguration({
      filter: configStore.plantListingConfiguration.filter,
      sort: value,
    })

    result.ok
      ? toast('Sortierreihenfolge gespeichert', 'success')
      : toast('Es ist ein Fehler beim Speichern der Sortierreihenfolge aufgetreten', 'error')
  }
}
</script>
