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
import type { TopNavigationAction } from '../types'
import {
  Trash as IconDelete,
  Edit as IconEdit,
  Cog as IconMenu,
  Camera as IconPhoto,
} from 'lucide-vue-next'
import { computed, onMounted, ref } from 'vue'
import TopNavigation from '../components/layout/TopNavigation.vue'
import PlantDetailsCards from '../components/PlantDetailsCards.vue'
import IFab from '../components/ui/IFab.vue'
import { useModal } from '../composables/useModal.ts'
import { usePlant } from '../composables/usePlant.ts'
import { usePlantView } from '../composables/usePlantView.ts'
import { useToast } from '../composables/useToast.ts'
import LayoutDock from '../layouts/LayoutDock.vue'
import { usePlantStore } from '../stores/plantStore.ts'
import { getUploadedFile } from '../util.ts'

interface Props {
}
interface Emits {
}

defineProps<Props>()
defineEmits<Emits>()

const { fabActions } = usePlantView()

const plantStore = usePlantStore()

const { getPlantName } = usePlant()
const { toast } = useToast()

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
    onClick: () => console.warn('todo: implement edit plant'),
  },
  {
    label: 'Löschen',
    icon: IconDelete,
    onClick: () => console.warn('todo: implement delete plant'),
  },
])

function selectImageViaInput() {
  inputImage.value?.click()
}

async function handleImageUpload(event: Event) {
  const errorToast = () => toast('Es ist ein Fehler beim hochladen des Bildes aufgetreten.', 'error')

  const imageResult = getUploadedFile(event)
  if (!imageResult.exist) {
    errorToast()
    return
  }

  const uploadResult = await plantStore.uploadPlantImage(imageResult.value)
  if (!uploadResult.ok) {
    errorToast()
    return
  }

  toast('Bild erfolgreich hochgeladen', 'success')
}

onMounted(async () => await plantStore.syncPlantWithRoute())
</script>
