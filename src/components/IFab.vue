<template>
  <div class="fab">
    <div tabindex="0" role="button" class="btn btn-lg btn-circle btn-primary">
      <component :is="icon" />
    </div>

    <!-- buttons that show up when FAB is open -->
    <button
      v-for="(action, i) in actions"
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
import type { FabAction } from '../types'
import {
  Plus as IconPlus,
} from 'lucide-vue-next'

interface Props {
  icon?: Component
  actions: Array<FabAction>
}

interface Emits {

}

const { icon = IconPlus } = defineProps<Props>()
defineEmits<Emits>()
</script>
