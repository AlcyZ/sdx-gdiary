<template>
  <div>
    edit: {{ wateringSchema.name }}
  </div>
</template>

<script lang="ts" setup>
import type { WateringSchema } from '../modules/nutrients/types'

interface Props {
  wateringSchema: WateringSchema
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
