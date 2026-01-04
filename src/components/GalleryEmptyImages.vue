<template>
  <div class="h-full flex items-center p-4">
    <IEmptyState
      title="Keine Pflanzenbilder"
      :title-icon="IconPhotoLibrary"
      title-icon-class="fill-gray-500"
      description="Du hast noch keine Bilder von deinen Pflanzen gemacht. Hole es gleich hier nach."
      cta="Erste Bild hochladen"
      :cta-icon="IconPhotoCamera"
      :illustration="IllustrationOrganizePhotos"
      @clicked="openUploadModal"
    />
  </div>
</template>

<script lang="ts" setup>
import IconPhotoCamera from '../icons/IconPhotoCamera.vue'
import IconPhotoLibrary from '../icons/IconPhotoLibrary.vue'
import IllustrationOrganizePhotos from '../illustrations/IllustrationOrganizePhotos.vue'
import IEmptyState from './ui/IEmptyState.vue'
import {useModal} from "../composables/useModal.ts";
import GalleryEmptyImagesModalUpload from "./GalleryEmptyImagesModalUpload.vue";
import {usePlantStore} from "../stores/plantStore.ts";

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()
const { showModal } = useModal()

function openUploadModal() {
  const { close } = showModal(GalleryEmptyImagesModalUpload, {
    plants: plantStore.plants,
  })
}
</script>
