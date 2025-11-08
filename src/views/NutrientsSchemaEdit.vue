<template>
  <div>
    <IFab
      :icon="IconMenu"
      class="mb-14"
      :actions="fabActions"
    />
    schema edit
  </div>
</template>

<script lang="ts" setup>
import { Cog as IconMenu } from 'lucide-vue-next'
import IFab from '../components/ui/IFab.vue'
import { useNutrientsView } from '../composables/useNutrientsView.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { fabActions } = useNutrientsView()
</script>
