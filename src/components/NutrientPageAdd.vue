<template>
  <ICard>
    --- Todo ---
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
