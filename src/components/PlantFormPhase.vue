<template>
  <IFieldset
    legend="Wachstumsphase"
  >
    <div>
      <IFloatingLabel
        label="Aktuelle Phase"
      >
        <select v-model="phase" class="select w-full">
          <option
            v-for="(plantPhase, i) in plantPhases"
            :key="i"
            :value="plantPhase.phase"
            :selected="phase === plantPhase.phase"
          >
            {{ plantPhase.label }}
          </option>
        </select>
      </IFloatingLabel>
      <div
        v-if="phaseError"
        class="text-xs text-error px-4 mt-1"
      >
        {{ phaseError }}
      </div>
    </div>

    <InputTextFloat
      v-model="start"
      :error="startError"
      label="Startdatum der Phase"
      type="date"
      class="mt-2"
      required
    />
  </IFieldset>
</template>

<script lang="ts" setup>
import type { PlantPhaseItem } from '../modules/plants/types'
import { ref } from 'vue'
import IFieldset from './IFieldset.vue'
import IFloatingLabel from './IFloatingLabel.vue'
import InputTextFloat from './InputTextFloat.vue'

interface Props {
  phaseError?: string
  startError?: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const plantPhases = ref<Array<PlantPhaseItem>>([
  {
    phase: 'germination',
    label: 'Keimung',
  },
  {
    phase: 'seedling',
    label: 'Sämling',
  },
  {
    phase: 'vegetation',
    label: 'Vegetationsphase',
  },
  {
    phase: 'pre-flower',
    label: 'Vorblüte',
  },
  {
    phase: 'flower',
    label: 'Blütephase',
  },
  {
    phase: 'ripening',
    label: 'Reifephase',
  },
  {
    phase: 'harvest',
    label: 'Ernte',
  },
  {
    phase: 'drying',
    label: 'Trocknung',
  },
  {
    phase: 'curing',
    label: 'Fermentierung',
  },
])

const phase = defineModel('phase')
const start = defineModel('start')
</script>
