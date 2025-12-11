<template>
  <ICard
    v-if="sortedHarvests.length > 0"
    class="w-full max-w-3xl"
  >
    <ICardTitle class="text-2xl flex items-center text-gray-900/70">
      <IconHarvest
        class="stroke-accent"
        :size="36"
      />
      Informationen zur Ernte
    </ICardTitle>
    <span class="opacity-60 text-xs pl-6">{{ sortedHarvests.length }} Einträge</span>

    <div class="flex flex-col gap-y-5">
      <PlantDetailsLogCard
        v-for="(log, i) in sortedHarvests"
        :key="i"
        :day="log.day"
        :time="log.time"
      >
        <PlantDetailsCardHarvestSession
          v-if="log.type === 'session'"
          :log="log"
        />
        <PlantDetailsCardHarvestFinish
          v-else
          :log="log"
        />
      </PlantDetailsLogCard>
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { Harvest } from '../modules/harvest/types'
import type { Plant } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  Scissors as IconHarvest,
} from 'lucide-vue-next'
import { computed } from 'vue'
import { useHarvest } from '../composables/useHarvest.ts'
import PlantDetailsCardHarvestSession from './PlantDetailsCardHarvestSession.vue'
import PlantDetailsLogCard from './PlantDetailsLogCard.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import PlantDetailsCardHarvestFinish from "./PlantDetailsCardHarvestFinish.vue";

interface Props {
  plant: Plant
}
interface Emits {

}

const { plant } = defineProps<Props>()
defineEmits<Emits>()

const { getDryingStateLabel, getDryingStateIcon } = useHarvest()

function getDayAndTime(timestamp: number) {
  const formatted = dayjs(new Date(timestamp)).format('DD.MM.YYYY HH:mm')
  const [day, time] = formatted.split(' ')

  return { day, time }
}

const sortedHarvests = computed(
  (): Array<Harvest & { day?: string, time?: string }> => plant.logs.harvests.toSorted((lhs, rhs) => rhs.timestamp - lhs.timestamp)
    .map(log => ({
      ...log,
      ...getDayAndTime(log.timestamp),
    })),
)
</script>
