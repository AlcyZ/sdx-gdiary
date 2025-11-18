<template>
  <ICard
    class="w-full max-w-3xl hidden sm:flex"
  >
    <IBtn
      class="w-full"
      @click="$router.push('/plants')"
    >
      Zurück
    </IBtn>
  </ICard>
</template>

<script lang="ts" setup>
import IBtn from './ui/IBtn.vue'
import ICard from './ui/ICard.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
