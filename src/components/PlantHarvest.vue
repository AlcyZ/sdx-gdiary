<template>
  <motion.div
    class="bg-white shadow rounded-box px-5 py-7 w-full max-w-2xl"
    :variants="scale075"
    initial="from"
    animate="to"
  >
    <div class="flex items-center justify-between mb-2">
      <ICardTitle class="text-2xl">
        Pflanze ernten
      </ICardTitle>

      <IInputDatetime
        v-model="date"
        class="text-sm"
        open-via-label
      />
    </div>

    <div>
      <div class="flex items-center">
        <ISwap
          v-model="isSessionForm"
          rotate
        >
          <ISwapOn>
            <IconSessionForm />
          </ISwapOn>
          <ISwapOff>
            <IconFinishForm />
          </ISwapOff>
        </ISwap>

        <span
          class="text-sm ml-2 text-gray-500 cursor-pointer"
          @click="isSessionForm = !isSessionForm"
        >
          Jetzt im Modus: "<span class="font-semibold">{{ textMode }}</span>"
        </span>
      </div>

      <div
        class="text-xs text-gray-400 pl-8"
        @click="isSessionForm = !isSessionForm"
      >
        (Klicken zum wechseln)
      </div>
    </div>

    <PlantHarvestInfobox />

    <HarvestSessionForm
      v-if="isSessionForm"
      v-model:weight="weight"
      v-model:container="container"
      v-model:info="info"
      v-model:state="state"
      :error-date="errors.date"
      :error-weight="errors.weight"
      :error-container="errors.container"
      :error-info="errors.info"
      :error-state="errors.state"
      class="my-4"
    />

    <HarvestFinishForm
      v-else
      v-model:weight="weight"
      v-model:container="container"
      v-model:info="info"
      :error-date="errors.date"
      :error-weight="errors.weight"
      :error-container="errors.container"
      :error-info="errors.info"
      :error-state="errors.state"
      class="my-4"
    />

    <div>
      <IBtn
        variant="neutral"
        class="w-full"
        :disabled="loading || hasFormErrors"
        :loading="loading"
        loading-type="ring"
        @click="save"
      >
        <IconSave />
        Speichern
      </IBtn>
    </div>
  </motion.div>
</template>

<script lang="ts" setup>
import type HarvestRepository from '../modules/harvest/harvest_repository.ts'
import type { NewHarvest, NewHarvestBase } from '../modules/harvest/types'
import type { Plant } from '../modules/plants/types'
import {
  BookCheck as IconFinishForm,
  Save as IconSave,
  ClipboardClock as IconSessionForm,
} from 'lucide-vue-next'
import { computed, inject, ref } from 'vue'
import { useHarvestForm } from '../composables/useHarvestForm.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_HARVEST } from '../di_keys.ts'
import HarvestFinishForm from './HarvestFinishForm.vue'
import HarvestSessionForm from './HarvestSessionForm.vue'
import PlantHarvestInfobox from './PlantHarvestInfobox.vue'
import IBtn from './ui/IBtn.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IInputDatetime from './ui/IInputDatetime.vue'
import ISwap from './ui/ISwap.vue'
import ISwapOff from './ui/ISwapOff.vue'
import ISwapOn from './ui/ISwapOn.vue'
import { motion } from "motion-v";
import {useContentAnimation} from "../composables/useContentAnimation.ts";

interface Props {
  plant: Plant
}

interface Emits {
  saved: []
}

const { plant } = defineProps<Props>()
const emit = defineEmits<Emits>()

const harvestRepo = inject(REPO_HARVEST) as HarvestRepository

const {
  date,
  weight,
  container,
  info,
  state,
  isSessionForm,
  errors,
  hasFormErrors,
  validate,
} = useHarvestForm()

const { toast } = useToast()
const { scale075 } = useContentAnimation()

const TEXT_MODE_SESSION = 'Session protokollieren'
const TEXT_MODE_FINISH = 'Ernte abschließen'

const textMode = computed(() => isSessionForm.value
  ? TEXT_MODE_SESSION
  : TEXT_MODE_FINISH,
)

const loading = ref(false)

async function save() {
  const validationResult = await validate()
  if (!validationResult.valid) {
    toast('Bitte fülle alle Pflichtfelder aus!', 'error')
    return
  }

  const harvest = getHarvestData()
  const result = await harvestRepo.save(plant.id, harvest)

  if (!result.ok) {
    toast('Es ist ein Fehler beim speichern der Ernte aufgetreten', 'error')
    console.error('[PlantHarvestSession.save]:', result.error)
    return
  }

  toast('Ernte gespeichert!', 'success')
  emit('saved')
}

function getHarvestData(): NewHarvest {
  const convertNum = (v: any) => typeof v === 'number' ? v : undefined
  const convertStr = (v: any) => typeof v === 'string' ? v !== '' ? v : undefined : undefined

  const baseData: NewHarvestBase = {
    weight: convertNum(weight.value),
    container: convertStr(container.value),
    info: convertStr(info.value),
    date: date.value,
  }

  return isSessionForm.value
    ? {
        ...baseData,
        type: 'session',
        state: state.value,
      }
    : {
        ...baseData,
        type: 'done',
      }
}
</script>
