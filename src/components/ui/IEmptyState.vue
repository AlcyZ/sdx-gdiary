<template>
  <div
    class="bg-white shadow px-9 py-4 w-full max-w-3xl rounded-box"
  >
    <h2 class="text-xl font-bold flex items-center leading-relaxed">
      {{ title }}
      <component
        :is="titleIcon"
        class="stroke-success ml-2"
        :size="32"
      />
    </h2>

    <component
      :is="illustration"
      class="w-full h-auto mt-4"
    />

    <p
      class="text-gray-400 text-sm mt-8 leading-relaxed"
    >
      {{ description }}
    </p>

    <IBtn
      variant="primary"
      class="text-base-100 w-full mt-6"
      @click="$router.push({ name: 'plant.add' })"
    >
      <component :is="ctaIcon" />
      {{ cta }}
    </IBtn>

    <slot name="bonus" />
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import IBtn from './IBtn.vue'

interface Props {
  title: string
  titleIcon: Component
  description: string
  illustration: Component
  cta: string
  ctaIcon: Component
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

defineSlots<{
  bonus: (props: Record<string, never>) => any
}>()
</script>
