<template>
  <div>
    <div class="flex items-center justify-between mb-3 border-b border-b-base-200">
      <h2 class="text-lg font-semibold">
        Zuchtschema
      </h2>

      <IBtn ghost @click="$router.push('/nutrients/schema/add')">
        <IconAdd />
        Neu
      </IBtn>
    </div>

    <div class="join join-vertical w-full">
      <ICollapse
        v-for="(wateringSchema, i) in wateringSchemaStore.wateringSchemas"
        :key="i"
        name="schema"
        class="border border-base-200 join-item"
        arrow
        closable
      >
        <ICollapseTitle class="font-semibold opacity-80">
          {{ wateringSchema.name }}
        </ICollapseTitle>

        <ICollapseContent>
          <IList>
            <IListRow class="tracking-wider font-semibold opacity-80 text-center">
              <IBadge
                variant="neutral"
                size="xs"
                class="w-14 h-6"
              >
                Menge
              </IBadge>

              <div>
                Zuchtschema verwalten
              </div>

              <IBtn
                square
                ghost
                size="sm"
                @click="$router.push(`/nutrients/schema/${wateringSchema.id}/edit`)"
              >
                <IconEdit :size="20" />
              </IBtn>

              <IBtn
                square
                ghost
                size="sm"
                @click="showDeleteSchemaModal(wateringSchema)"
              >
                <IconDelete :size="20" />
              </IBtn>
            </IListRow>
            <IListRow
              v-for="(fertilizer, j) in wateringSchema.fertilizers"
              :key="j"
            >
              <IBadge
                ghost
                size="xs"
                class="w-14 h-6 text-[9px]"
              >
                {{ fertilizer.amount }}ml/L
              </IBadge>
              <div class="flex items-center justify-between pr-9">
                <span class="font-semibold opacity-60">{{ fertilizer.fertilizer.name }}</span>
                <IBadge
                  size="xs"
                  outline
                >
                  {{ fertilizer.fertilizer.manufacturer || fallbackManufacturer }}
                </IBadge>
              </div>
              <IBtn
                square
                ghost
                size="sm"
                @click="editSchemaFertilizer(wateringSchema, fertilizer)"
              >
                <IconEdit :size="20" />
              </IBtn>

              <IBtn
                square
                ghost
                size="sm"
                @click="showDeleteSchemaFertilizerModal(fertilizer)"
              >
                <IconDelete :size="20" />
              </IBtn>
            </IListRow>
          </IList>
        </ICollapseContent>
      </ICollapse>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { WateringSchema, WateringSchemaFertilizer } from '../modules/nutrients/types'
import {
  CirclePlus as IconAdd,
  Trash as IconDelete,
  Edit as IconEdit,
} from 'lucide-vue-next'
import { inject } from 'vue'
import IBadge from '../components/ui/IBadge.vue'
import IBtn from '../components/ui/IBtn.vue'
import ICollapse from '../components/ui/ICollapse.vue'
import ICollapseContent from '../components/ui/ICollapseContent.vue'
import ICollapseTitle from '../components/ui/ICollapseTitle.vue'
import IList from '../components/ui/IList.vue'
import IListRow from '../components/ui/IListRow.vue'
import { useModal } from '../composables/useModal.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_WATERING_SCHEMA } from '../di_keys.ts'
import { useFertilizerStore } from '../stores/fertilizerStore.ts'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'
import { err } from '../util.ts'
import NutrientsOverviewModalSchemaEdit from './NutrientsOverviewModalSchemaEdit.vue'

interface Props {
}
interface Emits {
}

defineProps<Props>()
defineEmits<Emits>()

const fertilizerStore = useFertilizerStore()
const wateringSchemaStore = useWateringSchemaStore()

const { toast } = useToast()
const { showModal, showConfirmationModal } = useModal()
const wateringRepo = inject(REPO_WATERING_SCHEMA)

const fallbackManufacturer = 'Unbekannter Hersteller'

async function editSchemaFertilizer(wateringSchema: WateringSchema, fertilizer: WateringSchemaFertilizer) {
  const { close } = showModal(NutrientsOverviewModalSchemaEdit, {
    wateringSchema,
    fertilizer,
    fertilizers: fertilizerStore.fertilizers,
    onSaved: async () => {
      await wateringSchemaStore.syncWateringSchemas()
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
    await wateringSchemaStore.syncWateringSchemas()
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
    await wateringSchemaStore.syncWateringSchemas()
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
