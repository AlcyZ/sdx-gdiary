<template>
  <div>
    <div class="flex items-center space-x-1 my-3">
      <IBadge variant="accent" soft>
        <component
          :is="getDryingStateIcon(log.state)"
          class="mr-1"
          :size="20"
        />

        {{ getDryingStateLabel(log.state) }}
      </IBadge>

      <IBadge
        v-if="log.weight"
        variant="accent"
        outline
      >
        <IconWeight
          class="mr-1 fill-accent stroke-transparent"
          :size="20"
        />
        {{ log.weight }}G
      </IBadge>

      <IBadge
        v-if="log.container"
        soft
        variant="neutral"
      >
        <IconContainer
          class="mr-1"
          :size="20"
        />
        {{ log.container }}
      </IBadge>
    </div>

    <INote v-if="log.info">
      {{ log.info }}
    </INote>
  </div>
</template>

<script lang="ts" setup>
import type { HarvestSession } from '../modules/harvest/types'
import {
  PackageOpen as IconContainer,
  Weight as IconWeight,
} from 'lucide-vue-next'
import { useHarvest } from '../composables/useHarvest.ts'
import IBadge from './ui/IBadge.vue'
import INote from './ui/INote.vue'

interface Props {
  log: HarvestSession
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { getDryingStateLabel, getDryingStateIcon } = useHarvest()
</script>
