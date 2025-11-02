<template>
  <ICard class="w-full max-w-xl">
    <span class="text-error text-center">Aufgrund eines Fehlers wurde die Pflanze nicht richtig ausgewählt.</span>
    <button class="btn btn-secondary" @click="$emit('back')">
      Zurück
    </button>
  </ICard>
</template>

<script lang="ts" setup>
import ICard from './ICard.vue'

interface Props {

}
interface Emits {
  back: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>
