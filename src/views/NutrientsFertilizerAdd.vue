<template>
  <div class="flex justify-center items-center p-4 h-full">
    <motion.div
      class="flex flex-col gap-y-2 w-full max-w-2xl bg-white shadow rounded-box py-7 px-5"
      :variants="fadeUp"
      initial="from"
      animate="to"
    >
      <ICardTitle class="text-3xl">
        Neuen Dünger anlegen
      </ICardTitle>

      <form
        class="my-6"
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

      <div class="flex flex-col gap-y-2">
        <IBtn
          variant="primary"
          class="w-full text-base-100"
          @click="saveAndNew"
        >
          <IconAdd />
          Speichern & Neu
        </IBtn>
        <IBtn
          variant="neutral"
          class="w-full"
          @click="save"
        >
          <IconSave />
          Speichern
        </IBtn>
      </div>
    </motion.div>
    <IFab
      :icon="IconMenu"
      class="mb-14"
      :actions="fabActions"
    />
  </div>
</template>

<script lang="ts" setup>
import type { ToastVariant } from '../types'
import { CirclePlus as IconAdd, Cog as IconMenu, Save as IconSave } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { inject, ref } from 'vue'
import { useRouter } from 'vue-router'
import FertilizerForm from '../components/FertilizerForm.vue'
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'
import ICardTitle from '../components/ui/ICardTitle.vue'
import IFab from '../components/ui/IFab.vue'
import { useContentAnimation } from '../composables/useContentAnimation.ts'
import { useFertilizerForm } from '../composables/useFertilizerForm.ts'
import { useNutrientsView } from '../composables/useNutrientsView.ts'
import { usePageLayout } from '../composables/usePageLayout.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_FERTILIZERS } from '../di_keys.ts'
import { useFertilizerStore } from '../stores/fertilizerStore.ts'

interface Props {

}
interface Emits {

}

interface Emits {
}

defineProps<Props>()
defineEmits<Emits>()

usePageLayout({
  topNavigation: true,
})

const fertilizerStore = useFertilizerStore()

const router = useRouter()
const { fabActions } = useNutrientsView()
const { fadeUp } = useContentAnimation()
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

  resetForm({
    values: {
      manufacturer: manufacturer.value,
    },
  })
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
  else {
    await fertilizerStore.syncFertilizers()
  }

  return result
}
</script>
