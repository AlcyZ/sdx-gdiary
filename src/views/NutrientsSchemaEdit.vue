<template>
  <div class="h-full flex justify-center items-center p-4">
    <motion.div
      class="flex flex-col gap-y-2 w-full max-w-2xl bg-white shadow rounded-box py-7 px-5"
      :variants="fadeUp"
      initial="from"
      animate="to"
    >
      <ICardTitle class="text-3xl">
        Düngerschema bearbeiten
      </ICardTitle>

      <WateringSchemaForm
        v-model:name="name"
        v-model:fertilizers-data="fertilizersData"
        :error-name="errors.name"
        :error-fertilizer-data="errors.fertilizersData"
        class="my-6"
        @submit="updateSchema"
      />

      <div class="flex items-center">
        <IBtn
          variant="primary"
          class="w-full text-base-100"
          @click="updateSchema"
        >
          <IconSave />
          Aktualisieren
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
import type {
  EditedWateringSchema,
  NewWateringSchemaFertilizer,
  WateringSchemaFertilizer,
} from '../modules/nutrients/types'
import { Cog as IconMenu, Save as IconSave } from 'lucide-vue-next'
import { motion } from 'motion-v'
import { inject, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import IBtn from '../components/ui/IBtn.vue'
import ICardTitle from '../components/ui/ICardTitle.vue'
import IFab from '../components/ui/IFab.vue'
import WateringSchemaForm from '../components/WateringSchemaForm.vue'
import { useContentAnimation } from '../composables/useContentAnimation.ts'
import { useNutrientsView } from '../composables/useNutrientsView.ts'
import { usePageLayout } from '../composables/usePageLayout.ts'
import { useToast } from '../composables/useToast.ts'
import { useWateringSchemaForm } from '../composables/useWateringSchemaForm.ts'
import { REPO_WATERING_SCHEMA } from '../di_keys.ts'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'
import { err } from '../util.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

usePageLayout({
  topNavigation: true,
})

const wateringRepo = inject(REPO_WATERING_SCHEMA)

const wateringSchemaStore = useWateringSchemaStore()

const router = useRouter()
const { toast } = useToast()
const { fabActions } = useNutrientsView()
const { fadeUp } = useContentAnimation()

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
  if (!wateringSchemaStore.wateringSchema)
    return

  const validationResult = await validate()
  if (!validationResult.valid) {
    toast('Bitte fülle alle Pflichtfelder aus', 'error')
    return
  }

  const data: EditedWateringSchema = {
    id: wateringSchemaStore.wateringSchema.id,
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

async function resetSchemaForm() {
  await wateringSchemaStore.syncSchemaWithRoute()
  if (!wateringSchemaStore.wateringSchema)
    return

  resetForm({
    values: {
      name: wateringSchemaStore.wateringSchema.name,
      fertilizersData: wateringSchemaStore.wateringSchema.fertilizers.map((fertilizer: WateringSchemaFertilizer): NewWateringSchemaFertilizer => ({
        amount: fertilizer.amount,
        fertilizer: fertilizer.fertilizer,
      })),
    },
  })
}

onMounted(async () => {
  await resetSchemaForm()
})
</script>
