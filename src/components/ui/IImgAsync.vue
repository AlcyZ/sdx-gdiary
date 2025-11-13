<template>
  <div
    class="w-full h-full inline-block relative overflow-hidden bg-[#E0E0E0]"
  >
    <div
      v-if="loading"
      class="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10 bg-white/50"
    >
      <ILoading
        ring
      />
    </div>

    <img
      :src="imgSrc"
      alt=""
      class="w-full h-full object-cover"
      loading="lazy"
    >
  </div>
</template>

<script lang="ts" setup>
import ILoading from './ILoading.vue'

interface Props {
  imgSrc: string
  loading: boolean
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
