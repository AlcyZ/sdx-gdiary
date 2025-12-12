<template>
  <LayoutDock>
    <div class="flex-1 flex flex-col gap-y-6">
      <ICard
        v-for="(plant, i) in plants"
        :key="i"
      >
        <ICardTitle as="div" class="flex items-center justify-between">
          <h2 class="text-2xl font-semibold">
            {{ getPlantName(plant) }}
          </h2>

          <div class="space-x-0 5">
            <IPopover
              v-if="plant.show"
              side="top"
            >
              <div class="pl-6 py-3 space-y-4">
                <div class="flex items-center justify-between gap-x-6">
                  <IconCol />

                  <IInputSteps
                    v-model="plant.cols"
                    :steps="columns"
                    class="flex-1"
                  />
                </div>

                <div class="flex items-center justify-between gap-x-6">
                  <IconGap />

                  <IInputSteps
                    v-model="plant.gap"
                    :steps="gaps"
                    class="flex-1"
                  />
                </div>
              </div>

              <template #trigger>
                <IconSettings />
              </template>
            </IPopover>

            <IBtn
              square
              ghost
              size="lg"
              @click="plant.show = !plant.show"
            >
              <IconHide v-if="plant.show" />
              <IconShow v-else />
            </IBtn>
          </div>
        </ICardTitle>

        <div
          v-if="plant.show"
          class="mt-4"
        >
          <PlantImagesGallery
            :plant-id="plant.id"
            :images="plant.images"
            :cols="plant.cols"
            :gap="plant.gap"
            @change="handleChange"
          />
        </div>
      </ICard>
    </div>

    <IFab
      ref="fabBtn"
      class="mb-14"
      :icon="IconMore"
      :disabled="!isDirty"
      :actions="fabActions"
    />
  </LayoutDock>
</template>

<script lang="ts" setup>
import type { ChangeEvent, Column, Gap } from '../modules/gallery/types'
import type { Plant } from '../modules/plants/types'
import type { FabAction, Option } from '../types'
import {
  Grid2X2Check as IconCol,
  LayoutGrid as IconGap,
  ChevronUp as IconHide,
  Ellipsis as IconMore,
  ImageDown as IconSave,
  Settings as IconSettings,
  ChevronDown as IconShow,
  Undo as IconUndo,
} from 'lucide-vue-next'
import { computed, onMounted, ref, watch } from 'vue'
import PlantImagesGallery from '../componentsBackup/PlantImagesGallery.vue'
import IBtn from '../componentsBackup/ui/IBtn.vue'
import ICard from '../componentsBackup/ui/ICard.vue'
import ICardTitle from '../componentsBackup/ui/ICardTitle.vue'
import IFab from '../componentsBackup/ui/IFab.vue'
import IInputSteps from '../componentsBackup/ui/IInputSteps.vue'
import IPopover from '../componentsBackup/ui/IPopover.vue'
import { useGallerySortHandler } from '../composables/useGallerySortHandler.ts'
import { usePlant } from '../composables/usePlant.ts'
import { useToast } from '../composables/useToast.ts'
import LayoutDock from '../layoutsBackup/LayoutDock.vue'
import { hasBoolKey, hasNumKey } from '../modules/type_guard'
import { usePlantStore } from '../stores/plantStore.ts'
import { none, safeParseJson, some } from '../util.ts'

interface Props {

}
interface Emits {

}

interface Config {
  show: boolean
  cols: Column
  gap: Gap
}

type StorageConfig = Config & {
  id: number
}

defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()
const { getPlantName } = usePlant()
const { toast } = useToast()

const plants = ref<Array<Plant & Config>>([])
const isDirty = ref(false)

const { handle } = useGallerySortHandler(plants)

const plantConfigs = computed((): Array<StorageConfig> => plants.value.map(plant => ({
  id: plant.id,
  gap: plant.gap,
  cols: plant.cols,
  show: plant.show,
})))

const defaultConfig: Config = {
  show: false,
  cols: '3',
  gap: '0',
}
const columns = ['1', '2', '3', '4', '5', '6']
const gaps = ['0', '0.5', '1', '1.5', '2', '2.5', '3', '3.5', '4', '5']

function isStorageConfig(v: any): v is StorageConfig {
  if (typeof v !== 'object')
    return false

  if (!('cols' in v) || typeof v.cols !== 'string' || !columns.includes(v.cols))
    return false

  if (!('gap' in v) || typeof v.gap !== 'string' || !gaps.includes(v.gap))
    return false

  return hasNumKey(v, 'id') && hasBoolKey(v, 'show')
}

watch(() => plantStore.plants, (newPlants) => {
  loadPlants(newPlants)
})

watch(plantConfigs, (newConfigs, oldConfigs) => {
  if (oldConfigs.length === 0)
    return

  for (const [i, newConfig] of newConfigs.entries()) {
    if (!isEqualConfig(newConfig, oldConfigs[i])) {
      saveConfig(newConfig)
      return
    }
  }
}, { deep: true })

function loadPlants(data: Array<Plant>) {
  plants.value = data.map(plant => ({
    ...plant,
    ...loadConfig(plant),
  }))
}

onMounted(() => loadPlants(plantStore.plants))

function isEqualConfig(lhs: StorageConfig, rhs?: StorageConfig) {
  if (rhs === undefined)
    return false

  return lhs.id === rhs.id
    && lhs.cols === rhs.cols
    && lhs.gap === rhs.gap
    && lhs.show === rhs.show
}

function saveConfig(config: StorageConfig) {
  const key = `plant-gallery-${config.id}`
  localStorage.setItem(key, JSON.stringify(config))
}

function loadConfig(plant: Plant): StorageConfig {
  const key = `plant-gallery-${plant.id}`
  const option = getConfig(key)

  return option.exist ? option.value : { id: plant.id, ...defaultConfig }
}

function getConfig(key: string): Option<StorageConfig> {
  const value = localStorage.getItem(key)
  if (value === null)
    return none()

  const result = safeParseJson(value, isStorageConfig)
  if (!result.ok)
    return none()

  return some(result.value)
}

function handleChange(event: ChangeEvent, plantId: number) {
  handle(event, plantId)
  isDirty.value = true
}

const fabBtn = ref<InstanceType<typeof IFab> | undefined>()

function resetGallery(): void {
  loadPlants(plantStore.plants)
  isDirty.value = false
  fabBtn.value?.blur()
}

const fabActions: Array<FabAction> = [
  {
    icon: IconUndo,
    onClick: resetGallery,
  },
  {
    icon: IconSave,
    onClick: async () => {
      const result = await plantStore.sortPlantImages(plants.value)

      result.ok
        ? toast('Bilder sortiert', 'success')
        : toast('Es ist ein Fehler beim sortieren der Bilder aufgetreten', 'error')

      resetGallery()
    },
  },
]
</script>
