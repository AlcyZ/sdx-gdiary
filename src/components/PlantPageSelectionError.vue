<template>
  <ISelectionError
    text="Aufgrund eines Fehlers wurde die Pflanze nicht richtig ausgewählt."
  />
</template>

<script lang="ts" setup>
import ISelectionError from './ISelectionError.vue'

interface Props {

}
interface Emits {
  back: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>
