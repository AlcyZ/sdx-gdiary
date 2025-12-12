<template>
  <div class="space-y-4">
    <HarvestFormLabel
      label="Aktueller Trocknungsgrad"
      :error="errorState"
      required
    >
      <select
        v-model="state"
        class="select w-full"
        name="state"
      >
        <option
          v-for="(dryingState, i) in dryingStates"
          :key="i"
          :value="dryingState.state"
        >
          {{ dryingState.label }}
        </option>
      </select>
    </HarvestFormLabel>

    <HarvestFormLabel
      label="Gewicht"
      :error="errorWeight"
    >
      <input
        v-model.number="weight"
        type="number"
        name="weight"
        inputmode="decimal"
        class="input w-full"
        placeholder="Erntegewicht in Gram"
      >
    </HarvestFormLabel>

    <HarvestFormLabel
      label="Lagerbehälter"
      :error="errorContainer"
    >
      <input
        v-model="container"
        type="text"
        name="container"
        class="input w-full"
        placeholder="Behälter, in dem die Ernte gelagert wird. z.b: Glas, Netz oder auch Pizzakarton"
      >
    </HarvestFormLabel>

    <HarvestFormLabel
      label="Anmerkung"
      :error="errorInfo"
    >
      <textarea
        v-model="info"
        type="text"
        name="info"
        class="textarea w-full"
        placeholder="Zusatzinformation bzgl. der Ernte"
      />
    </HarvestFormLabel>
  </div>
</template>

<script lang="ts" setup>
import type { DryingState } from '../modules/harvest/types'
import { useDryingState } from '../composables/useDryingState.ts'
import HarvestFormLabel from './HarvestFormLabel.vue'

interface Props {
  errorWeight?: string
  errorContainer?: string
  errorInfo?: string
  errorState?: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { getDryingStateLabel } = useDryingState()

const weight = defineModel<number | undefined>('weight')
const container = defineModel<string | undefined>('container')
const info = defineModel<string | undefined>('info')
const state = defineModel<DryingState>('state', { required: true })

const dryingStatesArray: Array<DryingState> = ['wet', 'semi_dry', 'dry']
const dryingStates: Array<{
  state: DryingState
  label: string
}> = dryingStatesArray.map(state => ({
  state,
  label: getDryingStateLabel(state),
}))
</script>
