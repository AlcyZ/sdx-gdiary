<template>
  <div>
    overview ...


    <button class="btn btn-neutral" @click="$emit('back')">
      Back
    </button>
  </div>
</template>

<script lang="ts" setup>
import type { Fertilizer } from '../modules/nutrients/types'

interface Props {
  fertilizers: Array<Fertilizer>
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
