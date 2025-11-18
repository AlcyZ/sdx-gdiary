<template>
  <ICard
    class="w-full max-w-3xl"
  >
    <ICardTitle class="text-2xl">
      <component :is="icon" />
      <span>{{ title }}</span>
    </ICardTitle>

    <slot />
  </ICard>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'

interface Props {
  title: string
  icon: Component
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
