<template>
  <ICard
    class="w-full max-w-2xl"
    justify-actions-between
  >
    <div class="flex items-center justify-between">
      <ICardTitle class="text-3xl">
        Gießeintrag erstellen
      </ICardTitle>

      <IBtn
        ghost
        @click="addFertilizer"
      >
        <IconAdd />
      </IBtn>
    </div>

    <div class="my-4">
      <InputTextFloat
        v-model="amount"
        label="Wie viel Liter hast du gegossen?"
        type="number"
        class="py-3 border-b border-gray-300"
      />
      <div
        v-for="(fertilizer, i) in fertilizersData"
        :key="i"
        class="flex items-center justify-between border-b border-gray-300 py-3"
      >
        <div class="">
          <label class="select">
            <span class="label">Dünger</span>
            <select
              v-model="fertilizer.fertilizer"
            >
              <option
                v-for="(item, j) in fertilizers"
                :key="j"
                :value="item"
                :disabled="isSelected(item)"
              >
                {{ getFertilizerName(item) }}
              </option>
            </select>
          </label>

          <div>
            <label class="input">
              <span class="label">Menge</span>
              <input
                v-model.number="fertilizer.amount"
                type="number"
                placeholder="soso"
              >
            </label>
            <span class="text-xs opacity-40">
              sososo lala <span class="font-semibold opacity-60">bla bla</span> la haha
            </span>
          </div>
        </div>

        <IBtn
          square
          ghost
          @click="removeItem(i)"
        >
          <IconClose />
        </IBtn>
      </div>
    </div>

    <template #actions>
      <IBtn
        @click="$emit('back')"
      >
        <IconBack />
        Back
      </IBtn>

      <div class="join">
        <IBtn
          :disabled="amount === undefined"
          @click="applyRecommended"
        >
          Apply
        </IBtn>

        <IBtn
          variant="primary"
          class="text-base-100"
        >
          <IconSave />
          Speichern
        </IBtn>
      </div>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type { InferType } from 'yup'
import type { Fertilizer } from '../modules/nutrients/types'
import type { Plant } from '../modules/plants/types'
import { toTypedSchema } from '@vee-validate/yup'
import {
  CirclePlus as IconAdd,
  MoveLeft as IconBack,
  CircleMinus as IconClose,
  Save as IconSave,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { array, number, object, string } from 'yup'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import ICardTitle from './ICardTitle.vue'
import InputTextFloat from './InputTextFloat.vue'

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
const [fertilizersData] = defineField<'fertilizers', Array<FormFertilizerData>>('fertilizers')

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
