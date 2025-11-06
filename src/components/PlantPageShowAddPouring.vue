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
import type { InferType } from 'yup'
import type { Fertilizer } from '../modules/nutrients/types'
import type { Plant } from '../modules/plants/types'
import { toTypedSchema } from '@vee-validate/yup'
import dayjs from 'dayjs'
import {
  MoveLeft as IconBack,
  Zap as IconQuick,
  Trash as IconRemove,
    Plus as IconPlus,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import { array, number, object, string } from 'yup'
import IBadge from './IBadge.vue'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import ICardTitle from './ICardTitle.vue'
import IInputDatetime from './IInputDatetime.vue'
import IInputNumber from './IInputNumber.vue'
import {useModal} from "../composables/useModal.ts";
import PlantPageShowAddPouringModalAddFertilizer from "./PlantPageShowAddPouringModalAddFertilizer.vue";

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

const DEFAULT_AMOUNT = 1
const ERR_AMOUNT_REQUIRED = 'Es muss eine Menge angegeben werden'
const ERR_AMOUNT_TYPE = 'Es muss eine Zahl angegeben werden'

// Todo: replace
const dateSample = ref(dayjs().format('YYYY-MM-DDTHH:mm'))
const useFertilizer = ref(true)

const fertilizerSchema = object({
  id: number().required(),
  name: string().required(),
  manufacturer: string().optional(),
})

const fertilizerDataSchema = object({
  fertilizer: fertilizerSchema,
  recommended: number().optional(),
  amount: number().required(ERR_AMOUNT_REQUIRED),
})

const pourSchema = object({
  amount: number().typeError(ERR_AMOUNT_TYPE).required(ERR_AMOUNT_REQUIRED),
  ph: number().optional(),
  ec: number().optional(),
  fertilizers: array().of(fertilizerDataSchema),
})

type FormFertilizerData = InferType<typeof fertilizerDataSchema>

const validationSchema = toTypedSchema(pourSchema)

const { errors, defineField, validate } = useForm({
  validationSchema,
  initialValues: {
    amount: DEFAULT_AMOUNT,
    fertilizers: plant.wateringSchema?.fertilizers
      .map((item): FormFertilizerData => ({
        fertilizer: item.fertilizer,
        recommended: item.amount,
        amount: item.amount * DEFAULT_AMOUNT,
      }))
      || [],
  },
})

const [amount] = defineField<'amount', number>('amount')
const [ph] = defineField('ph')
const [ec] = defineField('ec')
const [fertilizersData] = defineField<'fertilizers', Array<FormFertilizerData>>('fertilizers')

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
  const { close } = showModal(PlantPageShowAddPouringModalAddFertilizer, {
    foo: 'Bar'
  })
}
</script>
