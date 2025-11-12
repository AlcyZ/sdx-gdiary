<template>
  <ICard
    class="w-full max-w-3xl"
  >
    <ICardTitle class="text-2xl">
      {{ title }}
    </ICardTitle>

    <slot />
  </ICard>
</template>

<script lang="ts" setup>
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'

interface Props {
  title: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
