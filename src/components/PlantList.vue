<template>
  <IList
    label="Pflanzen"
    :items="listItems"
  />
</template>

<script lang="ts" setup>
import type { ListItem } from '../types'
import {
  Trash as IconTrash,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { deletePlant } from '../modules/plants'
import IList from './IList.vue'

interface Props {
  plants: Array<Plant>
}
interface Emits {
  delete: [plant: number]
}

const { plants } = defineProps<Props>()
const emit = defineEmits<Emits>()

const listItems = computed(
  (): Array<ListItem> => plants.map((plant) => {
    return {
      text: plant.name,
      title: plant.strain,
      image: plant.image,
      actions: [
        {
          icon: IconTrash,
          onClick: async () => {
            await deletePlant(plant.id)
          },
        },
      ],
    }
  }),
)
</script>
