<template>
  <div
    class="w-full flex flex-col items-center gap-y-5 p-4"
    :class="{ 'h-full justify-center': !plantStore.hasPlants }"
  >
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
            <IconFilterList />
          </IBtn>
        </IDropdown>
      </header>

      <PlantListingCard />
    </template>

    <component
      :is="emptyComponent"
      v-else
      :variants="fadeUp"
      initial="from"
      animate="to"
    />

    <IFab
      :actions="fabActions"
      :icon="IconMenu"
    />
  </div>
</template>

<script lang="ts" setup>
import type { DropdownMenu } from '../types'
import {
  Cog as IconMenu,
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { computed } from 'vue'
import PlantListingCard from '../components/PlantListingCard.vue'
import PlantListingEmpty from '../components/PlantListingEmpty.vue'
import IBtn from '../components/ui/IBtn.vue'
import IDropdown from '../components/ui/IDropdown.vue'
import IFab from '../components/ui/IFab.vue'
import { usePageLayout } from '../composables/usePageLayout.ts'
import { usePlantView } from '../composables/usePlantView.ts'
import { useToast } from '../composables/useToast.ts'
import IconFilterList from '../icons/IconFilterList.vue'
import { isPlantListingFilter, isPlantListingSort } from '../modules/configuration/guard.ts'
import { useConfigurationStore } from '../stores/configurationStore.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import {useContentAnimation} from "../composables/useContentAnimation.ts";

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

usePageLayout({
  dock: true,
})

const { fabActions } = usePlantView()

const emptyComponent = motion.create(PlantListingEmpty)

const plantStore = usePlantStore()
const configStore = useConfigurationStore()
const { toast } = useToast()
const { fadeUp } = useContentAnimation()

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
        label: 'Geerntete anzeigen',
        value: 'show-harvested',
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
