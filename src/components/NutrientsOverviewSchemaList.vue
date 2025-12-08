<template>
  <NutrientsOverviewGroupings
    :groups
    collapse-content-class="grid grid-cols-[minmax(50px,_100px)_1fr_minmax(96px,_auto)] gap-x-2"
    slot-container-class="contents"
  >
    <template #header-actions="{ payload: schema }">
      <div
        v-if="schema"
        class="space-x-1 mr-2"
      >
        <IBtn
          square
          ghost
          size="lg"
          @click="$router.push({ name: 'nutrients.schema.edit', params: { schemaId: schema.id } })"
        >
          <IconEdit2 :size="20" />
        </IBtn>
        <IBtn
          square
          ghost
          size="lg"
          variant="error"
          @click="showDeleteSchemaModal(schema)"
        >
          <IconDelete2 :size="20" />
        </IBtn>
      </div>
    </template>

    <template
      #item="
        {
          item: fertilizer,
          payload: schema,
          index,
          length,
        }"
    >
      <div
        class="border-b py-3 border-b-gray-100 flex items-center"
        :class="{
          'border-b-3': index === length - 1,
        }"
      >
        <IBadge
          class="mr-2 font-semibold w-full px-2 py-1"
          variant="accent"
          soft
          size="sm"
        >
          {{ fertilizer.amount }}ml/L
        </IBadge>
      </div>
      <div
        class="border-b py-3 border-b-gray-100 flex flex-col justify-center"
        :class="{
          'border-b-3': index === length - 1,
        }"
      >
        <h4 class="font-semibold text-primary-content">
          {{ fertilizer.fertilizer.name }}
        </h4>
        <IBadge
          v-if="fertilizer.fertilizer.manufacturer"
          size="xs"
          class="text-gray-400"
        >
          {{ fertilizer.fertilizer.manufacturer }}
        </IBadge>
      </div>
      <div
        class="border-b py-3 border-b-gray-100"
        :class="{
          'border-b-3': index === length - 1,
        }"
      >
        <template v-if="schema">
          <IBtn
            square
            ghost
            size="lg"
            @click="editSchemaFertilizer(schema, fertilizer)"
          >
            <IconEdit :size="20" />
          </IBtn>
          <IBtn
            square
            ghost
            size="lg"
            variant="error"
            @click="showDeleteSchemaFertilizerModal(fertilizer)"
          >
            <IconDelete :size="20" />
          </IBtn>
        </template>
      </div>
    </template>
  </NutrientsOverviewGroupings>
</template>

<script lang="ts" setup>
import type { NewWateringSchemaFertilizer, WateringSchema, WateringSchemaFertilizer } from '../modules/nutrients/types'
import {
  Trash as IconDelete,
  Trash2 as IconDelete2,
  Edit as IconEdit,
  Edit2 as IconEdit2,
} from 'lucide-vue-next'
import { computed, inject } from 'vue'
import { useModal } from '../composables/useModal.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_WATERING_SCHEMA } from '../di_keys.ts'
import { useFertilizerStore } from '../stores/fertilizerStore.ts'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'
import { err } from '../util.ts'
import NutrientsOverviewGroupings from './NutrientsOverviewGroupings.vue'
import NutrientsOverviewModalSchemaEdit from './NutrientsOverviewModalSchemaEdit.vue'
import IBadge from './ui/IBadge.vue'
import IBtn from './ui/IBtn.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const wateringStore = useWateringSchemaStore()
const fertilizerStore = useFertilizerStore()

const { toast } = useToast()
const { showModal, showConfirmationModal } = useModal()
const wateringRepo = inject(REPO_WATERING_SCHEMA)

const fallbackManufacturer = 'Unbekannter Hersteller'

const groups = computed(() => wateringStore.wateringSchemas.map(schema => ({
  title: schema.name,
  payload: schema,
  items: schema.fertilizers,
})))

async function editSchemaFertilizer(wateringSchema: WateringSchema, fertilizer: WateringSchemaFertilizer) {
  const { close } = showModal(NutrientsOverviewModalSchemaEdit, {
    wateringSchema,
    fertilizer,
    fertilizers: fertilizerStore.fertilizers,
    onEdit: async (data: NewWateringSchemaFertilizer) => {
      const result = await wateringStore.updateSchemaFertilizer(wateringSchema.id, fertilizer.id, data)
      result.ok
        ? toast('Schema aktualisiert', 'success')
        : toast('Es ist ein Fehler aufgetreten', 'error')
      await close()
    },
  })
}

function showDeleteSchemaFertilizerModal(fertilizer: WateringSchemaFertilizer) {
  const name = `${fertilizer.fertilizer.name} (${fertilizer.fertilizer.manufacturer || fallbackManufacturer})`
  const text = `Bist du sicher, dass du '${name}' aus den Zuchtschema entfernen möchtest?`

  const onClick = async () => {
    const result = await wateringRepo?.deleteSchemaFertilizer(fertilizer) || err(undefined)

    if (!result.ok) {
      toast('Es ist ein Fehler beim entfernen des Düngers aus den Schema aufgetreten', 'error')
      return
    }

    toast('Dünger erfolgreich aus den Schema entfernt', 'success')
    await wateringStore.syncWateringSchemas()
  }

  showConfirmationModal({
    title: 'Dünger aus Schema entfernen',
    text,
    actions: [
      {
        label: 'Entfernen',
        icon: IconDelete,
        class: 'btn-error text-base-100',
        onClick,
      },
    ],
  })
}

function showDeleteSchemaModal(wateringSchema: WateringSchema) {
  const title = 'Bewässerungsschema löschen'
  const text = `Bist du sicher, dass das Bewässerungsschema '${wateringSchema.name}' gelöscht werden soll?`

  const onClick = async () => {
    const result = await wateringRepo?.deleteSchema(wateringSchema.id) || err(undefined)

    if (!result.ok) {
      toast('Es ist ein Fehler beim entfernen des Schemas aufgetreten', 'error')
      return
    }

    toast('Bewässerungsschema erfolgreich gelöscht', 'success')
    await wateringStore.syncWateringSchemas()
  }

  showConfirmationModal({
    title,
    text,
    actions: [
      {
        label: 'Löschen',
        icon: IconDelete,
        class: 'btn-error text-base-100',
        onClick,
      },
    ],
  })
}
</script>
