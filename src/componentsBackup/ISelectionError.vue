<template>
  <ICard class="w-full max-w-xl">
    <span class="text-error text-center">{{ text }}</span>
    <button class="btn btn-secondary" @click="$emit('back')">
      Zurück
    </button>
  </ICard>
</template>

<script lang="ts" setup>
import ICard from './ICard.vue'

interface Props {
  text: string
}
interface Emits {
  back: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>
