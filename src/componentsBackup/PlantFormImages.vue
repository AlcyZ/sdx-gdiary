<template>
  <ICard
    class="opacity-60"
  >
    <ICardTitle class="text-xl">
      Foto hinzufügen (optional)
    </ICardTitle>

    <p class="text-xs text-gray-400 my-3">
      Aktuelle Bilder helfen bei der Dokumentation des Fortschritts.
    </p>

    <IInputMultiFileUpload
      v-model="images"
      label="Klick hier, um ein oder mehrere Bilder auszuwählen, oder ziehe die Bilder hierher."
      accept="image/jpeg, image/png, image/webp"
    />
  </ICard>
</template>

<script lang="ts" setup>
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IInputMultiFileUpload from './ui/IInputMultiFileUpload.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const images = defineModel<FileList>()
</script>
