<template>
  <div class="flex-1 flex justify-center items-center">
    <ICard
      class="w-full max-w-2xl"
      class-actions="justify-between"
    >
      <ICardTitle class="text-3xl">
        Düngerschema bearbeiten
      </ICardTitle>

      <WateringSchemaForm
        v-model:name="name"
        v-model:fertilizers-data="fertilizersData"
        :error-name="errors.name"
        :error-fertilizer-data="errors.fertilizersData"
        :fertilizers="fertilizers"
        class="my-5"
        @submit="updateSchema"
      />

      <template #actions>
        <IBtn
          @click="$router.push('/nutrients')"
        >
          <IconBack />
          Zurück
        </IBtn>
        <IBtn
          variant="primary"
          class="text-base-100"
          @click="updateSchema"
        >
          <IconSave />
          Aktualisieren
        </IBtn>
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
import type {
  EditedWateringSchema,
  Fertilizer,
  NewWateringSchemaFertilizer,
  WateringSchema,
  WateringSchemaFertilizer,
} from '../modules/nutrients/types'
import { MoveLeft as IconBack, Cog as IconMenu, Save as IconSave } from 'lucide-vue-next'
import { inject, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'
import ICardTitle from '../components/ui/ICardTitle.vue'
import IFab from '../components/ui/IFab.vue'
import WateringSchemaForm from '../components/WateringSchemaForm.vue'
import { useNutrientsView } from '../composables/useNutrientsView.ts'
import { useToast } from '../composables/useToast.ts'
import { useWateringSchemaForm } from '../composables/useWateringSchemaForm.ts'
import { REPO_FERTILIZERS, REPO_WATERING_SCHEMA } from '../di_keys.ts'
import { err, none } from '../util.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const fertilizerRepo = inject(REPO_FERTILIZERS)
const wateringRepo = inject(REPO_WATERING_SCHEMA)

const route = useRoute()
const router = useRouter()
const { toast } = useToast()
const { fabActions } = useNutrientsView()

const fertilizers = ref<Array<Fertilizer>>([])
const wateringSchema = ref<WateringSchema | null>(null)

const {
  name,
  fertilizersData,
  errors,
  validate,
  resetForm,
} = useWateringSchemaForm({
  fertilizersData: [],
})

async function updateSchema() {
  if (!wateringSchema.value)
    return

  const validationResult = await validate()
  if (!validationResult.valid) {
    toast('Bitte fülle alle Pflichtfelder aus', 'error')
    return
  }

  const data: EditedWateringSchema = {
    id: wateringSchema.value.id,
    name: name.value!,
    fertilizers: fertilizersData.value,
  }

  const result = await wateringRepo?.updateSchema(data) || err(undefined)
  if (!result.ok) {
    toast('Es ist ein Fehler beim aktualisieren des Bewässerungsschemas aufgetreten', 'error')
    return
  }

  toast('Bewässerungsschema erfolgreich aktualisiert', 'success')
  await router.push('/nutrients')
}

async function syncFertilizers() {
  fertilizers.value = await fertilizerRepo?.getAll() || []
}

async function syncSchema() {
  const schemaId = Number(route.params.schemaId)
  if (Number.isNaN(schemaId))
    return

  const wateringSchemaResult = await wateringRepo?.getById(schemaId) || none()
  if (!wateringSchemaResult?.exist)
    return

  wateringSchema.value = wateringSchemaResult.value
}

async function resetSchemaForm() {
  await syncSchema()
  if (!wateringSchema.value)
    return

  resetForm({
    values: {
      name: wateringSchema.value.name,
      fertilizersData: wateringSchema.value.fertilizers.map((fertilizer: WateringSchemaFertilizer): NewWateringSchemaFertilizer => ({
        amount: fertilizer.amount,
        fertilizer: fertilizer.fertilizer,
      })),
    },
  })
}

onMounted(async () => {
  await Promise.all([
    syncFertilizers(),
  ])
  await syncFertilizers()
  await resetSchemaForm()
})
</script>
