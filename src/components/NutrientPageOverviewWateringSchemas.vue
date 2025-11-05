<template>
  <div>
    <div class="flex items-center justify-between mb-3 border-b border-b-base-200">
      <h2 class="text-lg font-semibold">
        Zuchtschema
      </h2>

      <IBtn ghost @click="$emit('addSchema')">
        <IconAdd />
        Neu
      </IBtn>
    </div>

    <div class="join join-vertical w-full">
      <ICollapse
        v-for="(wateringSchema, i) in wateringSchemas"
        :key="i"
        name="schema"
        class="border border-base-200 join-item"
        arrow
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
              >
                <IconEdit :size="20" />
              </IBtn>

              <IBtn
                square
                ghost
                size="sm"
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
import type { Fertilizer, WateringSchema, WateringSchemaFertilizer } from '../modules/nutrients/types'
import {
  CirclePlus as IconAdd,
  Trash as IconDelete,
  Edit as IconEdit,
} from 'lucide-vue-next'
import { useModal } from '../composables/useModal.ts'
import IBadge from './IBadge.vue'
import IBtn from './IBtn.vue'
import ICollapse from './ICollapse.vue'
import ICollapseContent from './ICollapseContent.vue'
import ICollapseTitle from './ICollapseTitle.vue'
import IList from './IList.vue'
import IListRow from './IListRow.vue'
import NutrientPageOverviewWateringSchemaModalEditFertilizer
  from './NutrientPageOverviewWateringSchemaModalEditFertilizer.vue'

interface Props {
  wateringSchemas: Array<WateringSchema>
  fertilizers: Array<Fertilizer>
}
interface Emits {
  sync: []
  addSchema: []
}

const { fertilizers } = defineProps<Props>()
const emit = defineEmits<Emits>()

const { showModal } = useModal()

const fallbackManufacturer = 'Unbekannter Hersteller'

async function editSchemaFertilizer(wateringSchema: WateringSchema, fertilizer: WateringSchemaFertilizer) {
  const { close } = showModal(NutrientPageOverviewWateringSchemaModalEditFertilizer, {
    wateringSchema,
    fertilizer,
    fertilizers,
    onSaved: async () => {
      emit('sync')
      await close()
    },
  })
}
</script>
