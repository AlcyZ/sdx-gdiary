<template>
  <div>
    gallery
  </div>
</template>

<script lang="ts" setup>
import { usePageLayout } from '../composables/usePageLayout.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

usePageLayout({
  dock: true,
})
</script>
