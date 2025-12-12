<template>
  <div>
    <div class="flex items-center space-x-1 my-3">
      <IBadge
        v-if="log.weight"
        variant="accent"
        outline
      >
        <IconWeight
          class="mr-1 fill-accent stroke-transparent"
          :size="20"
        />
        <span>Insgesamt:</span>
        <span class="font-semibold">{{ log.weight }}G</span>
      </IBadge>

      <IBadge
        v-if="log.container"
        variant="neutral"
        soft
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
import type { HarvestFinished } from '../modules/harvest/types'
import {
  PackageOpen as IconContainer,
  Weight as IconWeight,
} from 'lucide-vue-next'
import IBadge from './ui/IBadge.vue'
import INote from './ui/INote.vue'

interface Props {
  log: HarvestFinished
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
