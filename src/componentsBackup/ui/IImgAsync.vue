<template>
  <div
    class="inline-block relative overflow-hidden bg-[#E0E0E0]"
    :class="sizeClass"
  >
    <div
      v-if="loading"
      class="absolute top-0 left-0 flex items-center justify-center z-10 bg-white/50"
      :class="sizeClass"
    >
      <ILoading
        ring
      />
    </div>

    <img
      :src="imgSrc"
      alt=""
      class="object-cover"
      :class="sizeClass"
      loading="lazy"
    >
  </div>
</template>

<script lang="ts" setup>
import ILoading from './ILoading.vue'

interface Props {
  imgSrc: string
  loading: boolean
  sizeClass: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
