<template>
  <ICard
    class="w-full max-w-2xl"
    class-actions="justify-between"
  >
    <form @submit.prevent="saveAndNew">
      <ICardTitle class="text-3xl">
        Neuen Dünger anlegen
      </ICardTitle>

      <div class="my-5">
        <InputFertilizer
          ref="inputFertilizer"
          v-model:name="name"
          v-model:manufacturer="manufacturer"
          :error-name="errors.name"
          :error-manufacturer="errors.manufacturer"
        />
      </div>
      <input type="submit" class="hidden">
    </form>

    <template #actions>
      <IBtn
        @click="$emit('back')"
      >
        <IconBack />
        Zurück
      </IBtn>
      <div class="join">
        <IBtn
          variant="primary"
          class="join-item text-base-100"
          @click="save"
        >
          <IconSave />
          Speichern
        </IBtn>
        <IBtn
          variant="neutral"
          class="join-item"
          @click="saveAndNew"
        >
          <IconAdd />
          Speichern & Neu
        </IBtn>
      </div>
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type { ToastVariant } from '../types'
import { toTypedSchema } from '@vee-validate/yup'
import {
  CirclePlus as IconAdd,
  MoveLeft as IconBack,
  Save as IconSave,
} from 'lucide-vue-next'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as yup from 'yup'
import { useToast } from '../composables/useToast.ts'
import FertilizerRepository from '../modules/nutrients/fertilizer_repository.ts'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import ICardTitle from './ICardTitle.vue'
import InputFertilizer from './InputFertilizer.vue'

interface Props {

}
interface Emits {
  back: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { showToast } = useToast()

const inputFertilizer = ref<InstanceType<typeof InputFertilizer> | null>(null)

const ERR_NAME_REQUIRED = 'Es muss ein Name angegeben werden'

const fertilizerSchema = yup.object({
  name: yup.string().required(ERR_NAME_REQUIRED),
  manufacturer: yup.string().optional(),
})

const validationSchema = toTypedSchema(fertilizerSchema)
const { errors, defineField, validate } = useForm({
  validationSchema,
  initialValues: {
    name: '',
    manufacturer: undefined,
  },
})

const [name] = defineField<'name', string>('name')
const [manufacturer] = defineField<'manufacturer', string | undefined>('manufacturer')

function toast(message: string, variant: ToastVariant = 'error', close?: () => void) {
  showToast({ message, variant, duration: 1500 }, close ? { close } : undefined)
}

async function save() {
  if (!(await validateForm()))
    return

  if (await saveFertilizer())
    toast('Dünger erfolgreich gespeichert', 'success', () => emit('back'))
}

async function saveAndNew() {
  if (!(await validateForm()))
    return

  if (!(await saveFertilizer()))
    return

  toast('Dünger erfolgreich gespeichert', 'success')

  name.value = ''
  inputFertilizer.value?.focusName()
}

async function validateForm() {
  const validationResult = await validate()

  if (!validationResult.valid) {
    toast('Alle Pflichtfelder müssen richtig ausgefüllt werden')
  }

  return validationResult.valid
}

async function saveFertilizer() {
  const repo = await FertilizerRepository.create()
  const result = await repo.save({
    name: name.value,
    manufacturer: manufacturer.value,
  })

  if (!result.ok) {
    console.error('[NutrientPageAddFertilizer:saveFertilizer] - failed to save fertilizer due to error in repository:', result.error)
    toast('Dünger konnte nicht gespeichert werden')
  }

  return result.ok
}
</script>
