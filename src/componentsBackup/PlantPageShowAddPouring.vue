<template>
  <ICard
    class="w-full max-w-3xl"
    class-actions="border-t border-t-base-200 pt-1 mt-2"
    justify-actions-between
  >
    <IMobileBack @back="$emit('back')" />

    <div class="px-4 py-4 border-b border-base-200">
      <div class="flex items-center justify-between">
        <h1 class="text-3xl font-semibold">
          Neuer Gießeintrag
        </h1>

        <IInputDatetime v-model="date" />
      </div>

      <div class="flex mt-1">
        <IBadge
          variant="primary"
          class="text-base-100 text-sm py-1 px-2"
        >
          {{ plantName }}
        </IBadge>
      </div>
    </div>

    <div>
      <h3 class="text-xl font-bold">
        Gießmenge & Messwerte
      </h3>

      <IInputNumber
        v-model="amount"
        label="Gießmenge (Liter)"
        :error="errors.amount"
        class="mt-6 mb-3"
        full-width
        size="xl"
      />

      <IFieldset
        legend="Zusatzinformationen"
      >
        <IInputNumber
          v-model="ph"
          label="pH-Wert"
          :error="errors.ph"
          class="mt-3"
          full-width
          size="sm"
        />

        <IInputNumber
          v-model="ec"
          label="EC-Wert"
          :error="errors.ec"
          class="mt-3"
          full-width
          size="sm"
        />
      </IFieldset>
    </div>

    <hr class="my-4 text-base-300">

    <div>
      <div class="flex items-center justify-between mb-1">
        <h3 class="text-xl font-bold">
          Verwendete Dünger
        </h3>

        <input v-model="useFertilizer" type="checkbox" class="toggle">
      </div>

      <!-- fertilizers container -->
      <div
        v-if="useFertilizer"
      >
        <ICard
          v-for="(fertilizerData, i) in fertilizersData"
          :key="i"
          class="my-2"
        >
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold">{{ fertilizerData.fertilizer.name }}</span>

            <IBtn
              square
              outline
              variant="error"
              size="lg"
              @click="removeFertilizer(i)"
            >
              <IconRemove />
            </IBtn>
          </div>

          <div
            class="text-xs opacity-60 border-b border-b-base-200"
          >
            <span v-if="fertilizerData.recommended">Empfohlene Menge des Schemas: {{ fertilizerData.recommended }}ml/L</span>
            <span v-else>&nbsp;</span>
          </div>

          <div class="flex items-center ">
            <input
              v-model="fertilizerData.amount"
              type="number"
              inputmode="decimal"
              class="input mr-6"
            >

            <IBtn
              v-if="fertilizerData.recommended"
              outline
              variant="accent"
              @click="fertilizerData.amount = formatNumberToNumber(amount * fertilizerData.recommended)"
            >
              <IconQuick />
              {{ formatNumber(amount * fertilizerData.recommended) }}ml/L
            </IBtn>
          </div>
        </ICard>

        <IBtn
          variant="secondary"
          class="w-full mt-2"
          @click="openAddFertilizerModal"
        >
          <IconPlus />
          Weiteren Dünger hinzufügen
        </IBtn>
      </div>
    </div>

    <template #actions>
      <IBtn
        class="hidden sm:flex"
        @click="$emit('back')"
      >
        <IconBack />
        Zurück
      </IBtn>

      <IBtn
        variant="primary"
        class="text-base-100 w-full sm:w-auto"
        @click="save"
      >
        <IconSave />
        Speichern
      </IBtn>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type { Fertilizer, WateringSchemaFertilizer } from '../modules/nutrients/types'
import type { NewWateringLog, Plant } from '../modules/plants/types'
import {
  MoveLeft as IconBack,
  Plus as IconPlus,
  Zap as IconQuick,
  Trash as IconRemove,
  Check as IconSave,
} from 'lucide-vue-next'
import { computed, inject, ref } from 'vue'
import { useModal } from '../composables/useModal.ts'
import { usePouringForm } from '../composables/usePouringForm.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_PLANT } from '../di_keys.ts'
import { err } from '../util.ts'
import IBadge from '../components/IBadge.vue'
import IBtn from '../components/IBtn.vue'
import ICard from '../components/ICard.vue'
import IFieldset from '../components/IFieldset.vue'
import IInputDatetime from '../components/IInputDatetime.vue'
import IInputNumber from '../components/IInputNumber.vue'
import IMobileBack from '../components/IMobileBack.vue'
import PlantPageShowAddPouringModalAddFertilizer from './PlantPageShowAddPouringModalAddFertilizer.vue'

interface Props {
  fertilizers: Array<Fertilizer>
  plant: Plant
}
interface Emits {
  back: []
  backAndSync: []
}

const { plant, fertilizers } = defineProps<Props>()
const emit = defineEmits<Emits>()

const plantRepo = inject(REPO_PLANT)

const { showModal } = useModal()
const { toast } = useToast()

const useFertilizer = ref(true)

const {
  DEFAULT_AMOUNT,
  date,
  amount,
  ph,
  ec,
  fertilizersData,
  errors,
  validate,
} = usePouringForm(plant)

const plantName = computed(() => plant.name !== undefined && plant.name !== '' ? `${plant.name} (${plant.strain})` : plant.strain)

function formatNumber(number: number): string {
  const format = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  return format.format(number)
}

function formatNumberToNumber(number: number): number {
  return Number(formatNumber(number))
}

function removeFertilizer(index: number) {
  fertilizersData.value.splice(index, 1)
}

function openAddFertilizerModal() {
  const addSchemaFertilizer = (item: WateringSchemaFertilizer) => fertilizersData.value.push({
    fertilizer: item.fertilizer,
    amount: formatNumberToNumber(amount.value * item.amount),
    recommended: item.amount,
  })

  const addFertilizer = (item: Fertilizer) => fertilizersData.value.push({
    fertilizer: item,
    amount: DEFAULT_AMOUNT,
  })

  const { close } = showModal(PlantPageShowAddPouringModalAddFertilizer, {
    fertilizers,
    wateringSchema: plant.wateringSchema,
    data: fertilizersData.value,
    onAddSchemaFertilizer: async (item: WateringSchemaFertilizer) => {
      addSchemaFertilizer(item)
      await close()
    },
    onAddFertilizer: async (item: Fertilizer) => {
      addFertilizer(item)
      await close()
    },
  })
}

async function save() {
  const validationResult = await validate()
  if (!validationResult.valid) {
    toast('Bitte fülle alle Pflichtfelder aus', 'error')
    return
  }

  const data: NewWateringLog = {
    plantId: plant.id,
    date: new Date(date.value).getTime(),
    amount: amount.value,
    ph: ph.value,
    ec: ec.value,
    fertilizers: fertilizersData.value.map(item => ({
      id: item.fertilizer.id,
      name: item.fertilizer.name,
      manufacturer: item.fertilizer.manufacturer,
      amount: item.amount,
    })),
  }

  const result = await plantRepo?.pourPlant(data) || err(undefined)
  if (!result.ok) {
    toast('Es ist ein Fehler beim speichern des Gießeintrags aufgetreten', 'error')
    return
  }

  toast('Gießeintrag erfolgreich gespeichert', 'success')
  emit('backAndSync')
}
</script>
