<template>
  <LayoutDock>
    <div
      v-for="(_, i) in Array.from({ length: 12 })"
      class=" my-6"
    >
      hi :)<br>
    </div>
  </LayoutDock>
</template>

<script lang="ts" setup>
import LayoutDock from '../layouts/LayoutDock.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
