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

interface Props {
  fertilizers: Array<Fertilizer>
  plant: Plant
}
interface Emits {
  back: []
}

const { plant, fertilizers } = defineProps<Props>()
defineEmits<Emits>()

const DEFAULT_AMOUNT = 1
const ERR_AMOUNT_REQUIRED = 'Es muss eine Menge angegeben werden'

const dateSample = ref(dayjs().format('YYYY-MM-DDTHH:mm'))

const fertilizerSchema = object({
  id: number().required(),
  name: string().required(),
  manufacturer: string().optional(),
})

const fertilizerDataSchema = object({
  schemaFertilizerId: number().optional(),
  amount: number().required(ERR_AMOUNT_REQUIRED),
  fertilizer: fertilizerSchema,
})

const pourSchema = object({
  amount: number().required(ERR_AMOUNT_REQUIRED),
  ph: number().optional(),
  ec: number().optional(),
  fertilizers: array().of(fertilizerDataSchema),
})

type FormFertilizerData = InferType<typeof fertilizerDataSchema>
type _FormPourData = InferType<typeof pourSchema>

const validationSchema = toTypedSchema(pourSchema)

const { errors, defineField, validate } = useForm({
  validationSchema,
  initialValues: {
    amount: DEFAULT_AMOUNT,
    fertilizers: plant.wateringSchema?.fertilizers
      .map((item): FormFertilizerData => ({
        schemaFertilizerId: item.id,
        amount: item.amount,
        fertilizer: item.fertilizer,
      }))
      || [],
  },
})

const [amount] = defineField<'amount', number>('amount')
const [ph] = defineField('ph')
const [ec] = defineField('ec')
const [fertilizersData] = defineField<'fertilizers', Array<FormFertilizerData>>('fertilizers')

const plantName = computed(() => plant.name !== undefined && plant.name !== '' ? `${plant.name} (${plant.strain})` : plant.strain)

function addFertilizer() {
  const fertilizer = fertilizers.filter(
    fertilizer => fertilizersData.value.every(dataset => dataset.fertilizer.id !== fertilizer.id),
  )[0]
  if (fertilizer === undefined)
    return

  fertilizersData.value.push({
    amount: DEFAULT_AMOUNT,
    fertilizer,
  })
}

function removeItem(index: number) {
  fertilizersData.value.splice(index, 1)
}

function isSelected(fertilizer: Fertilizer): boolean {
  return fertilizersData.value.some(dataset => dataset.fertilizer.id === fertilizer.id)
}

function getRecommended(data: FormFertilizerData): number | undefined {
  const recommendedPerLiter = plant.wateringSchema
    ?.fertilizers
    .find(item => item.id === data.schemaFertilizerId)
    ?.amount

  if (recommendedPerLiter === undefined || amount.value === undefined)
    return undefined

  return recommendedPerLiter * amount.value
}

function getFertilizerName(fertilizer: Fertilizer): string {
  return fertilizer.manufacturer !== undefined && fertilizer.manufacturer !== ''
    ? `${fertilizer.manufacturer} - ${fertilizer.name}`
    : fertilizer.name
}

function getRecommendedFormatted(data: FormFertilizerData): string | undefined {
  const value = getRecommended(data)
  if (value === undefined)
    return undefined

  const format = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 2 })
  return format.format(value)
}

function applyRecommended() {
  for (let i = 0; i < fertilizersData.value.length; i++) {
    const recommended = getRecommended(fertilizersData.value[i]!)
    if (recommended === undefined)
      continue

    fertilizersData.value[i]!.amount = recommended
  }
}
</script>
