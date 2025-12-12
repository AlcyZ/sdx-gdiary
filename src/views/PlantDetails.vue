<template>
  <LayoutDock>
    <template #top-navigation>
      <TopNavigation
        :title="plantName"
        :actions="actions"
        @back="$router.push('/plants')"
      />
      <input
        ref="inputImage"
        class="hidden"
        type="file"
        multiple
        accept="image/jpeg, image/png, image/webp"
        @change="handleImageUpload"
      >
    </template>

    <div class="w-full flex flex-col items-center gap-y-5 mt-4">
      <PlantDetailsCards
        v-if="plantStore.plant"
        :plant="plantStore.plant"
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
import type { NewPlantContainer } from '../modules/plants/types'
import type { TopNavigationAction } from '../types'
import {
  Cylinder as IconContainer,
  Trash as IconDelete,
  Edit as IconEdit,
  Cog as IconMenu,
  Camera as IconPhoto,
} from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import TopNavigation from '../componentsBackup/layout/TopNavigation.vue'
import PlantDetailsCards from '../componentsBackup/PlantDetailsCards.vue'
import PlantDetailsModalContainer from '../componentsBackup/PlantDetailsModalContainer.vue'
import IFab from '../componentsBackup/ui/IFab.vue'
import { useModal } from '../composables/useModal.ts'
import { usePlant } from '../composables/usePlant.ts'
import { usePlantView } from '../composables/usePlantView.ts'
import { useToast } from '../composables/useToast.ts'
import LayoutDock from '../layouts/LayoutDock.vue'
import { usePlantStore } from '../stores/plantStore.ts'
import { getUploadedFiles } from '../util.ts'

interface Props {
}
interface Emits {
}

defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()

const router = useRouter()
const { fabActions } = usePlantView()
const { getPlantName, showDeleteConfirmationModal } = usePlant()
const { toast } = useToast()
const { showModal } = useModal()

const inputImage = ref<HTMLInputElement | undefined>()

const plantName = computed(() => plantStore.plant ? getPlantName(plantStore.plant) : '')

const actions = ref<Array<TopNavigationAction>>([
  {
    label: 'Bild hinzufügen',
    icon: IconPhoto,
    onClick: selectImageViaInput,
  },
  {
    label: 'Bearbeiten',
    icon: IconEdit,
    onClick: () => router.push(`/plants/${plantStore.plant?.id}/edit`),
  },
  {
    label: 'Löschen',
    icon: IconDelete,
    onClick: () => {
      if (plantStore.plant)
        showDeleteConfirmationModal(plantStore.plant, () => router.push('/plants'))
    },
  },
  {
    label: 'Behälter ändern',
    icon: IconContainer,
    onClick: async () => await showPlantContainerModal(),
  },
])

async function showPlantContainerModal() {
  const { close } = showModal(PlantDetailsModalContainer, {
    onSave: async (container: NewPlantContainer) => {
      const result = await plantStore.addContainer(container)

      result.ok
        ? toast('Neuer Behälter hinzugefügt', 'success')
        : toast('Es ist ein Fehler beim hinzufügen des Behälters aufgetreten', 'error')

      await close()
    },
  })
}

function selectImageViaInput() {
  inputImage.value?.click()
}

async function handleImageUpload(event: Event) {
  const errorToast = () => toast('Es ist ein Fehler beim hochladen des Bildes aufgetreten.', 'error')

  const option = getUploadedFiles(event)
  if (!option.exist) {
    errorToast()
    return
  }

  const results = await Promise.all(
    Array.from(option.value)
      .map(file => plantStore.uploadPlantImage(file, false)),
  )

  const hasError = results.some(r => !r.ok)
  const hasSuccess = results.some(r => r.ok)

  if (hasSuccess)
    await plantStore.syncData()

  if (hasError && hasSuccess) {
    toast('Mindestens ein Bild konnte nicht hochgeladen werden', 'warning')
    console.warn('[PlantDetails.handleImageUpload]: At least one image upload failed', results)
  }
  else if (hasError) {
    errorToast()
    console.error('[PlantDetails.handleImageUpload]: Failed to upload images:', results)
  }
  else if (hasSuccess) {
    toast('Bilder erfolgreich hochgeladen', 'success')
  }
}

onMounted(async () => await plantStore.syncPlantWithRoute())
</script>
