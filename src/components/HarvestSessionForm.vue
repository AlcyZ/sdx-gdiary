<template>
  <div class="space-y-4">
    <HarvestSessionFormLabel
      label="Trocknungsgrad"
      :error="errorState"
      required
    >
      <select
        v-model="state"
        class="select w-full"
      >
        <option
          v-for="(dryingState, i) in dryingStates"
          :key="i"
          :value="dryingState.state"
        >
          {{ dryingState.label }}
        </option>
      </select>
    </HarvestSessionFormLabel>

    <HarvestSessionFormLabel
      label="Gewicht"
      :error="errorWeight"
    >
      <input
        v-model.number="weight"
        type="number"
        inputmode="decimal"
        class="input w-full"
        placeholder="Erntegewicht in Gram"
      >
    </HarvestSessionFormLabel>

    <HarvestSessionFormLabel
      label="Behälter"
      :error="errorContainer"
    >
      <input
        v-model="container"
        type="text"
        class="input w-full"
        placeholder="Behälter, in dem die Ernte gelagert wird. z.b: Glas, Netz oder auch Pizzakarton"
      >
    </HarvestSessionFormLabel>

    <HarvestSessionFormLabel
      label="Anmerkung"
      :error="errorInfo"
    >
      <textarea
        v-model="info"
        type="text"
        class="textarea w-full"
        placeholder="Zusatzinformation bzgl. der Ernte"
      />
    </HarvestSessionFormLabel>
  </div>
</template>

<script lang="ts" setup>
import type { DryingState } from '../modules/harvest/types'
import { useDryingState } from '../composables/useDryingState.ts'
import HarvestSessionFormLabel from './HarvestSessionFormLabel.vue'

interface Props {
  errorDate?: string
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
