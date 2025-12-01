<template>
  <ICard>
    <ICardTitle class="text-xl">
      Anbau-Details
    </ICardTitle>

    <p class="text-xs text-gray-400 my-3">
      Definiere das Medium, den Container, doe Größe in Liter sowie eine optionale Info.
    </p>

    <div>
      <h4>Medium wählen</h4>
      <label class="select select-lg w-full">
        <select v-model="medium">
          <option
            v-for="(item, i) in mediums"
            :key="i"
            :value="i"
          >
            {{ item }}
          </option>
        </select>
      </label>
      <div
        v-if="mediumError"
        class="text-xs text-error px-4 mt-1"
        v-text="mediumError"
      />
    </div>

    <div class="mt-2">
      <h4>Behälter wählen</h4>

      <IInput
        v-model="container"
        full-width
        :error="containerError"
        size="lg"
        placeholder="z.b. Air Pot, Stofftopf oder einfach Plastik."
      />
    </div>

    <div class="mt-2">
      <h4>Topfgröße in Liter (z.B. 10L)</h4>

      <IInput
        v-model="volume"
        full-width
        type="number"
        input-mode="decimal"
        :error="volumeError"
        size="lg"
        placeholder="z.B. 12L"
      />
    </div>

    <div class="mt-2">
      <h4>Zusatzinformationen</h4>

      <textarea
        v-model="notes"
        class="textarea w-full"
        size="lg"
        placeholder="(Optional) Hier kannst du noch zusätzliche Informationen zum Medium eintragen"
      />
      <div
        v-if="notesError"
        class="text-xs text-error px-4 mt-1"
        v-text="notesError"
      />
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { PlantContainerMedium } from '../modules/plant_container/types'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IInput from './ui/IInput.vue'

interface Props {
  mediumError?: string
  containerError?: string
  volumeError?: string
  notesError?: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const mediums: Record<PlantContainerMedium, string> = {
  soil: 'Erde',
  coco: 'Koko',
  hydro: 'Hydro',
  rockwool: 'Steinwolle',
  custom: 'Custom',
}

const medium = defineModel<PlantContainerMedium>('medium', { required: true })
const container = defineModel<string>('container', { required: true })
const volume = defineModel<number>('volume', { required: true })
const notes = defineModel<string>('notes')
</script>
