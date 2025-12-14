<template>
  <div>
    nutrients overview
  </div>
</template>

<script lang="ts" setup>
import { useLayout } from '../composables/useLayout.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

useLayout({
  dockVisible: true,
  topNavigationVisible: false,
})
</script>
