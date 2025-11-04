<template>
  <ICard
    class="w-full max-w-2xl"
    class-actions="justify-between"
  >
    <ICardTitle class="text-3xl">
      Neuen Dünger anlegen
    </ICardTitle>

    <form
      class="my-5"
      @submit.prevent="saveAndNew"
    >
      <InputFertilizer
        ref="inputFertilizer"
        v-model:name="name"
        v-model:manufacturer="manufacturer"
        :error-name="errors.name"
        :error-manufacturer="errors.manufacturer"
      />
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
import {
  CirclePlus as IconAdd,
  MoveLeft as IconBack,
  Save as IconSave,
} from 'lucide-vue-next'
import { inject, ref } from 'vue'
import { useFertilizerForm } from '../composables/useFertilizerForm.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_FERTILIZERS } from '../di_keys.ts'
import IBtn from './IBtn.vue'
import ICard from './ICard.vue'
import ICardTitle from './ICardTitle.vue'
import InputFertilizer from './InputFertilizer.vue'

interface Props {

}
interface Emits {
  sync: []
  back: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const { showToast } = useToast()

const inputFertilizer = ref<InstanceType<typeof InputFertilizer> | null>(null)

const { errors, defineField, validate } = useFertilizerForm({
  name: '',
  manufacturer: undefined,
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

const fertilizerRepo = inject(REPO_FERTILIZERS)

async function saveFertilizer() {
  if (!fertilizerRepo)
    return

  const result = await fertilizerRepo.save({
    name: name.value,
    manufacturer: manufacturer.value,
  })

  if (!result.ok) {
    console.error('[NutrientPageAddFertilizer:saveFertilizer] - failed to save fertilizer due to error in repository:', result.error)
    toast('Dünger konnte nicht gespeichert werden')
  } else {
    emit('sync')
  }

  return result
}
</script>
