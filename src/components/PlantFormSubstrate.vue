<template>
  <ICard>
    <ICardTitle class="text-xl">
      Anbau-Details
    </ICardTitle>

    <p class="text-xs text-gray-400 my-3">
      Definiere das Substrat und die Größe des Topfes.
    </p>

    <div>
      <h4>Substrat / Medium wählen</h4>
      <label class="select select-lg w-full">
        <select v-model="substrate">
          <option
            v-for="(item, i) in substrates"
            :key="i"
            :value="item"
            :selected="item === substrate"
          >
            {{ item }}
          </option>
        </select>
      </label>
    </div>

    <div
      v-if="substrateInternal === 'Custom'"
      class="mt-2"
    >
      <h4>Eigenes Substrat</h4>

      <IInput
        v-model="substrate"
        full-width
        :error="substrateError"
        placeholder="z.B. Steinwolle oder Spezialmischung"
      />
    </div>

    <div class="mt-2">
      <h4>Topfgröße in Liter (z.B. 10L)</h4>

      <IInput
        v-model="size"
        full-width
        :error="sizeError"
        size="lg"
        placeholder="z.B. 12L oder 6cm x 8cm x 10cm"
      />
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { PlantSubstrateType } from '../modules/plants/types'
import { computed, nextTick, ref, watch } from 'vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IInput from './ui/IInput.vue'

interface Props {
  substrate?: string
  substrateError?: string
  sizeError?: string
}
interface Emits {
  'update:substrate': [value: string]
}

const { substrate: substrateProp } = defineProps<Props>()
const emit = defineEmits<Emits>()

const substrates: Array<PlantSubstrateType> = ['Erde', 'Coco', 'Hydro', 'Custom']

function getInitialSubstrate() {
  if (substrateProp === undefined) {
    return ''
  }

  if (substrates.includes(substrateProp as PlantSubstrateType))
    return substrateProp

  return substrateProp !== '' ? 'Custom' : ''
}

const substrateInternal = ref(getInitialSubstrate())

const size = defineModel<string>('size', { required: true })

const substrate = computed({
  get(): string | undefined {
    return substrateProp
  },
  set(value: string | undefined): void {
    if (value !== undefined)
      emit('update:substrate', value)
  },
})

watch(() => substrateProp, (newVal?: string) => {
  if (newVal === undefined || newVal === '')
    return

  if (substrates.includes(newVal as PlantSubstrateType)) {
    substrateInternal.value = newVal
  }
  else {
    substrateInternal.value = 'Custom'
    nextTick(() => emit('update:substrate', newVal))
  }
})

watch(substrateInternal, (newVal: string) => {
  newVal === 'Custom'
    ? emit('update:substrate', '')
    : emit('update:substrate', newVal)
})
</script>
