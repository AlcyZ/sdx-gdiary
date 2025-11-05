<template>
  <IFieldset
    legend="Substrat / Medium"
  >
    <div>
      <IFloatingLabel
        label="Wähle das Substrat oder trage einen eigenen Typ ein"
      >
        <ISelect
          v-model="substrateInternal"
          :options="substrates"
          class="w-full"
        >
          <template #option="{ item }">
            <option :value="item" :selected="item === substrate">
              {{ item }}
            </option>
          </template>
        </ISelect>
      </IFloatingLabel>

      <div class="text-xs text-error px-4 mt-1">
        {{ substrateError }}
      </div>
    </div>

    <InputTextFloat
      v-if="substrateInternal === 'Custom'"
      v-model="substrate"
      label="Eigener Substrattyp z.B. Steinwolle oder Spezialmischung"
      class="mt-2"
    />

    <InputTextFloat
      v-model="size"
      label="Gib die Größe des Topfes oder Volumens des Substrats an (z.B. 12L, 15cm x 15cm x 15cm)"
      type="text"
      class="mt-2"
      :error="sizeError"
      required
    />
  </IFieldset>
</template>

<script lang="ts" setup>
import type { PlantSubstrateType } from '../modules/plants/types'
import { computed, ref, watch } from 'vue'
import IFieldset from './IFieldset.vue'
import IFloatingLabel from './IFloatingLabel.vue'
import InputTextFloat from './InputTextFloat.vue'
import ISelect from './ISelect.vue'

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

const substrateInternal = ref('')

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

watch(substrateInternal, (newVal: string) => {
  newVal === 'Custom'
    ? emit('update:substrate', '')
    : emit('update:substrate', newVal)
})
</script>
