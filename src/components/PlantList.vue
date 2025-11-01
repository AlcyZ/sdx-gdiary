<template>
  <IList
    label="Pflanzen"
    :items="listItems"
  />
</template>

<script lang="ts" setup>
import type { Plant } from '../modules/plants/types'
import type { ListItem } from '../types'
import {
  Trash as IconTrash,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { PLANT_PLACEHOLDER_IMAGE } from '../util.ts'
import IList from './IList.vue'

interface Props {
  plants: Array<Plant>
}
interface Emits {
  delete: [plant: Plant]
}

const { plants } = defineProps<Props>()
const emit = defineEmits<Emits>()

const listItems = computed(
  (): Array<ListItem> => plants.map((plant) => {
    return {
      text: plant.name || '',
      title: plant.strain,
      image: PLANT_PLACEHOLDER_IMAGE,
      actions: [
        {
          icon: IconTrash,
          onClick: () => emit('delete', plant),
        },
      ],
    }
  }),
)
</script>
