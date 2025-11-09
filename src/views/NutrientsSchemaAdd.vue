<template>
  <div class="flex-1 flex items-center justify-center">
    <ICard
      class="w-full max-w-2xl"
      class-actions="justify-between"
    >
      <ICardTitle class="text-3xl">
        Düngerschema hinzufügen
      </ICardTitle>

      <WateringSchemaForm
        v-model:name="name"
        v-model:fertilizers-data="fertilizersData"
        :error-name="errors.name"
        :error-fertilizer-data="errors.fertilizersData"
        class="my-5"
        @submit="saveAndNew"
      />

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
import type { NewWateringSchema } from '../modules/nutrients/types'
import {
  CirclePlus as IconAdd,
  MoveLeft as IconBack,
  Cog as IconMenu,
  Save as IconSave,
} from 'lucide-vue-next'
import { inject } from 'vue'
import { useRouter } from 'vue-router'
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'
import ICardTitle from '../components/ui/ICardTitle.vue'
import IFab from '../components/ui/IFab.vue'
import WateringSchemaForm from '../components/WateringSchemaForm.vue'
import { useNutrientsView } from '../composables/useNutrientsView.ts'
import { useToast } from '../composables/useToast.ts'
import { useWateringSchemaForm } from '../composables/useWateringSchemaForm.ts'
import { REPO_WATERING_SCHEMA } from '../di_keys.ts'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'

interface Props {
}
interface Emits {
  back: []
  backAndSync: []
}

defineProps<Props>()
defineEmits<Emits>()

const wateringRepo = inject(REPO_WATERING_SCHEMA)
const wateringSchemaStore = useWateringSchemaStore()

const router = useRouter()
const { toast } = useToast()
const { fabActions } = useNutrientsView()

const {
  name,
  fertilizersData,
  errors,
  validate,
  resetForm,
} = useWateringSchemaForm({
  fertilizersData: [],
})

async function save() {
  if (!(await saveSchema()))
    return

  toast('Zuchtschema erfolgreich gespeichert', 'success')
  await router.push('/nutrients')
}

async function saveAndNew() {
  if (!(await saveSchema()))
    return

  toast('Zuchtschema erfolgreich gespeichert', 'success')

  resetForm({ values: { name: '', fertilizersData: fertilizersData.value } })
}

async function saveSchema(): Promise<boolean> {
  if (!wateringRepo)
    return false

  if (!(await validateForm()))
    return false

  const schema: NewWateringSchema = {
    name: name.value!,
    fertilizers: fertilizersData.value,
  }

  const result = await wateringRepo.save(schema)

  if (!result.ok) {
    toast('Zuchtschema konnte nicht gespeichert werden', 'error')
  }
  else {
    await wateringSchemaStore.syncWateringSchemas()
  }

  return result.ok
}

async function validateForm(): Promise<boolean> {
  const result = await validate()

  if (!result.valid)
    toast('Bitte fülle alle Pflichtfelder aus und weise mindestens einen Dünger zu', 'error')

  return result.valid
}
</script>
