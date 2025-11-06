<template>
  <ICard
    class="w-full max-w-3xl"
    justify-actions-between
  >
    <div class="flex items-center justify-between">
      <ICardTitle class="text-3xl flex items-center">
        Neuer Gießeintrag
        <IBadge
          variant="primary"
          class="text-base-100"
        >
          {{ plantName }}
        </IBadge>
      </ICardTitle>

      <IInputDatetime v-model="dateSample" />
    </div>

    <div class="my-5">
      <h3 class="text-xl font-bold">
        Gießmenge & Messwerte
      </h3>

      <IInputNumber
        v-model="amount"
        label="Gießmenge (Liter)"
        info="Wichtig für die Berechnung der Düngermenge."
        :error="errors.amount"
        class="mt-3"
        full-width
      />

      <IInputNumber
        v-model="ph"
        label="pH-Wert"
        :error="errors.ph"
        class="mt-3"
        full-width
      />

      <IInputNumber
        v-model="ec"
        label="EC-Wert"
        :error="errors.ec"
        class="mt-3"
        full-width
      />
    </div>

    <div class="my-5">
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
        <div
          v-for="(fertilizerData, i) in fertilizersData"
          :key="i"
          class="py-2 border-t border-t-base-200"
        >
          <div class="flex items-center justify-between">
            <span class="text-lg font-semibold">{{ fertilizerData.fertilizer.name }}</span>

            <IBtn
              square
              outline
              variant="error"
              size="sm"
              @click="removeFertilizer(i)"
            >
              <IconRemove :size="20" />
            </IBtn>
          </div>

          <div
            v-if="fertilizerData.recommended"
            class="text-xs opacity-60"
          >
            Empfohlene Menge des Schemas: {{ fertilizerData.recommended }}ml/L
          </div>

          <div class="flex items-center ">
            <input
              v-model="fertilizerData.amount"
              type="number"
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
        </div>
      </div>

      <IBtn
        variant="secondary"
        class="w-full mt-2"
        @click="openAddFertilizerModal"
      >
        <IconPlus />
        Weiteren Dünger hinzufügen
      </IBtn>
    </div>

    <template #actions>
      <IBtn
        @click="$emit('back')"
      >
        <IconBack />
        Zurück
      </IBtn>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type { Fertilizer, WateringSchemaFertilizer } from '../modules/nutrients/types'
import type { Plant } from '../modules/plants/types'
import dayjs from 'dayjs'
import {
  MoveLeft as IconBack,
  Plus as IconPlus,
  Zap as IconQuick,
  Trash as IconRemove,
} from 'lucide-vue-next'
import { computed, ref } from 'vue'
import { useModal } from '../composables/useModal.ts'
import { usePouringForm } from '../composables/usePouringForm.ts'
import IBadge from './IBadge.vue'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import ICardTitle from './ICardTitle.vue'
import IInputDatetime from './IInputDatetime.vue'
import IInputNumber from './IInputNumber.vue'
import PlantPageShowAddPouringModalAddFertilizer from './PlantPageShowAddPouringModalAddFertilizer.vue'

interface Props {
  fertilizers: Array<Fertilizer>
  plant: Plant
}
interface Emits {
  back: []
}

const { plant, fertilizers } = defineProps<Props>()
defineEmits<Emits>()

const { showModal } = useModal()

// Todo: replace with proper fields
const dateSample = ref(dayjs().format('YYYY-MM-DDTHH:mm'))
const useFertilizer = ref(true)

const {
  DEFAULT_AMOUNT,
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
</script>
