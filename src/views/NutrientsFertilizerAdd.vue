<template>
  <div class="flex-1 flex justify-center items-center">
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
        <FertilizerForm
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
          @click="$router.push('/nutrients')"
        >
          <IconBack />
          Zurück
        </IBtn>
        <div class="join">
          <IBtn
            variant="neutral"
            class="join-item"
            @click="saveAndNew"
          >
            <IconAdd />
            Speichern & Neu
          </IBtn>
          <IBtn
            variant="primary"
            class="join-item text-base-100"
            @click="save"
          >
            <IconSave />
            Speichern
          </IBtn>
        </div>
      </template>
    </ICard>
    <IFab
      :icon="IconMenu"
      class="mb-14"
      :actions="fabActions"
    />
  </div>
</template>

<script lang="ts" setup>
import type { ToastVariant } from '../types'
import { CirclePlus as IconAdd, MoveLeft as IconBack, Cog as IconMenu, Save as IconSave } from 'lucide-vue-next'
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import FertilizerForm from '../components/FertilizerForm.vue'
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'
import ICardTitle from '../components/ui/ICardTitle.vue'
import IFab from '../components/ui/IFab.vue'
import { useFertilizerForm } from '../composables/useFertilizerForm.ts'
import { useNutrientsView } from '../composables/useNutrientsView.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_FERTILIZERS } from '../di_keys.ts'

interface Props {

}
interface Emits {

}

interface Emits {
  sync: []
  back: []
}

defineProps<Props>()
defineEmits<Emits>()

const router = useRouter()
const { fabActions } = useNutrientsView()
const { showToast } = useToast()

const inputFertilizer = ref<InstanceType<typeof FertilizerForm> | null>(null)

const {
  name,
  manufacturer,
  errors,
  validate,
  resetForm,
} = useFertilizerForm()

function toast(message: string, variant: ToastVariant = 'error', close?: () => void) {
  showToast({ message, variant, duration: 1500 }, close ? { close } : undefined)
}

async function save() {
  if (!(await validateForm()))
    return

  if (!(await saveFertilizer()))
    return

  toast('Dünger erfolgreich gespeichert', 'success')
  await router.push('/nutrients')
}

async function saveAndNew() {
  if (!(await validateForm()))
    return

  if (!(await saveFertilizer()))
    return

  toast('Dünger erfolgreich gespeichert', 'success')

  resetForm({})
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
  }

  return result
}
</script>
