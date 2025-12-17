<template>
  <div>
    <PlantDetailsCards
      v-if="plantStore.plant"
      :plant="plantStore.plant"
    />
    <IFab
      :actions="fabActions"
      :icon="IconMenu"
    />
  </div>
</template>

<script lang="ts" setup>
import type { NewPlantContainer } from '../modules/plants/types'
import { Cog as IconMenu } from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import PlantDetailsCards from '../components/PlantDetailsCards.vue'
import PlantDetailsModalContainer from '../components/PlantDetailsModalContainer.vue'
import IFab from '../components/ui/IFab.vue'
import { useDropdown } from '../composables/useDropdown.ts'
import { useModal } from '../composables/useModal.ts'
import { usePageLayout } from '../composables/usePageLayout.ts'
import { usePlant } from '../composables/usePlant.ts'
import { usePlantView } from '../composables/usePlantView.ts'
import { useToast } from '../composables/useToast.ts'
import IconDelete from '../icons/IconDelete.vue'
import IconEditSquare from '../icons/IconEditSquare.vue'
import IconPhotoCamera from '../icons/IconPhotoCamera.vue'
import IconSpa from '../icons/IconSpa.vue'
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
const { createItem } = useDropdown()

const plantName = computed(() => plantStore.plant ? getPlantName(plantStore.plant) : '')

usePageLayout({
  dock: true,
  topNavigation: {
    title: plantName,
    actions: [
      {
        type: 'item',
        content: createItem('Bild hinzufügen', IconPhotoCamera),
        onClick: selectImageViaInput,
      },
      {
        type: 'item',
        content: createItem('Bearbeiten', IconEditSquare),
        onClick: () => router.push(`/plants/${plantStore.plant?.id}/edit`),
      },
      {
        type: 'item',
        content: createItem('Löschen', IconDelete),
        onClick: () => {
          if (plantStore.plant)
            showDeleteConfirmationModal(plantStore.plant, () => router.push('/plants'))
        },
      },
      {
        type: 'item',
        content: createItem('Behälter ändern', IconSpa),
        onClick: async () => await showPlantContainerModal(),
      },
    ],
  },
})

const inputImage = ref<HTMLInputElement | undefined>()

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

// @ts-expect-error needs to be refactored
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
