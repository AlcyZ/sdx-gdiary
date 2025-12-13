<template>
  <div class="fab fixed bottom-5 right-5">
    <div
      ref="fabMainBtn"
      tabindex="0"
      role="button"
      class="btn btn-lg btn-circle btn-primary text-base-100"
      v-bind="attrs"
    >
      <component :is="icon" />
    </div>

    <!-- buttons that show up when FAB is open -->
    <button
      v-for="(action, i) in actions"
      ref="fabButtons"
      :key="i"
      class="btn btn-lg btn-circle"
      @click="action.onClick"
    >
      <component :is="action.icon" />
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { Component } from 'vue'
import type { FabAction } from '../../types'
import {
  Plus as IconPlus,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'

interface Props {
  icon?: Component
  actions?: Array<FabAction>
  disabled?: boolean
}

interface Emits {

}

const {
  icon = IconPlus,
  actions = [],
  disabled = false,
} = defineProps<Props>()
defineEmits<Emits>()

const attrs = computed(
  () => disabled ? { disabled: true } : {},
)

const fabMainBtn = ref<HTMLDivElement | undefined>()
const fabButtons = ref<Array<HTMLButtonElement> | undefined>()

function blur() {
  fabButtons.value?.forEach(button => button.blur())
  fabMainBtn.value?.blur()
}

defineExpose({
  blur,
})
</script>
