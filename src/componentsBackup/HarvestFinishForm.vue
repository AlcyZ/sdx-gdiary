<template>
  <div class="space-y-4">
    <HarvestFormLabel
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
    </HarvestFormLabel>

    <HarvestFormLabel
      label="Lagerbehälter"
      :error="errorContainer"
    >
      <input
        v-model="container"
        type="text"
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
        class="textarea w-full"
        placeholder="Zusatzinformation bzgl. der Ernte"
      />
    </HarvestFormLabel>
  </div>
</template>

<script lang="ts" setup>
import HarvestFormLabel from './HarvestFormLabel.vue'

interface Props {
  errorDate?: string
  errorWeight?: string
  errorContainer?: string
  errorInfo?: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const weight = defineModel<number | undefined>('weight')
const container = defineModel<string | undefined>('container')
const info = defineModel<string | undefined>('info')
</script>
