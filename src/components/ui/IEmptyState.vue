<template>
  <div
    class="bg-white shadow px-9 py-4 w-full max-w-3xl rounded-box"
  >
    <h2 class="text-xl font-bold flex items-center justify-between leading-relaxed">
      {{ title }}
      <component
        :is="titleIcon"
        class="stroke-success ml-2"
        :class="titleIconClass"
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
      size="lg"
      class="text-base-100 w-full mt-6"
      @click="handleClick"
    >
      <component :is="ctaIcon" class="fill-base-100" />
      {{ cta }}
    </IBtn>

    <slot name="bonus" />
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { RouteLocationRaw } from 'vue-router'
import { useRouter } from 'vue-router'
import IBtn from './IBtn.vue'

interface Props {
  title: string
  titleIcon: Component
  titleIconClass?: string
  description: string
  illustration: Component
  cta: string
  ctaIcon: Component
  to?: RouteLocationRaw
}
interface Emits {
  clicked: []
}

const { to } = defineProps<Props>()
const emit = defineEmits<Emits>()

defineSlots<{
  bonus: (props: Record<string, never>) => any
}>()

const router = useRouter()

function handleClick() {
  emit('clicked')

  if (to !== undefined)
    router.push(to)
}
</script>
