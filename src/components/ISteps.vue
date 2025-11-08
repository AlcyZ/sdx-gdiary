<template>
  <ul
    class="steps"
    :class="stepsClass"
  >
    <template v-if="!!$slots.customStep">
      <slot
        v-for="(step, i) in steps"
        :key="i"
        :item="step"
        name="customStep"
      />
    </template>
    <template v-else>
      <IStep
        v-for="(step, i) in steps"
        :key="i"
      >
        <slot name="step" :item="step" />
      </IStep>
    </template>
  </ul>
</template>

<script lang="ts" setup generic="T">
import { computed } from 'vue'
import IStep from './IStep.vue'

interface Props {
  vertical?: boolean
  steps: Array<T>
}
interface Emits {

}

const { vertical = false } = defineProps<Props>()
defineEmits<Emits>()
defineSlots<{
  step: (props: { item: T }) => any
  customStep: (props: { item: T, key: number }) => any
}>()

const stepsClass = computed(() => vertical ? 'steps-vertical' : undefined)
</script>
