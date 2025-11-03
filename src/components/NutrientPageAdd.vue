<template>
  <ICard>
    --- Todo ---
  </ICard>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import ICard from './ICard.vue'

interface Props {

}
interface Emits {
  back: []
}

defineProps<Props>()
defineEmits<Emits>()

const fert = ref<NewFertilizer>({ name: '', manufacturer: undefined })
</script>
