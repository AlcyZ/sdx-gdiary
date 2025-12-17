<template>
  <motion.div
    class="bg-white shadow rounded-box px-5 py-7 w-full max-w-2xl"
    :variants="scale075"
    initial="from"
    animate="to"
  >
    <div class="flex items-center justify-between mb-2">
      <div class="text-2xl font-semibold">
        Ernte bearbeiten
      </div>

      <IInputDatetime
        v-model="date"
        open-via-label
        class="text-sm"
      />
    </div>

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
        @click="update"
      >
        <IconSave />
        Bearbeiten
      </IBtn>
    </div>
  </motion.div>
</template>

<script lang="ts" setup>
import type HarvestRepository from '../modules/harvest/harvest_repository.ts'
import type { Harvest, HarvestBase } from '../modules/harvest/types'
import type { Plant } from '../modules/plants/types'
import type { WithId } from '../types'
import dayjs from 'dayjs'
import {
  Save as IconSave,
} from 'lucide-vue-next'
import { motion } from 'motion-v'
import { inject, onMounted, ref } from 'vue'
import { useContentAnimation } from '../composables/useContentAnimation.ts'
import { useHarvestForm } from '../composables/useHarvestForm.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_HARVEST } from '../di_keys.ts'
import HarvestFinishForm from './HarvestFinishForm.vue'
import HarvestSessionForm from './HarvestSessionForm.vue'
import IBtn from './ui/IBtn.vue'
import IInputDatetime from './ui/IInputDatetime.vue'

interface Props {
  plant: Plant
  harvest: Harvest
}
interface Emits {
  updated: []
}

const { plant, harvest } = defineProps<Props>()
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
  resetForm,
} = useHarvestForm()
const { scale075 } = useContentAnimation()

const { resultToast, toast } = useToast()

const loading = ref(false)

async function update() {
  const validationResult = await validate()
  if (!validationResult.valid) {
    toast('Bitte fülle alle Pflichtfelder aus!', 'error')
    return
  }

  const harvest = getHarvestData()
  const result = await harvestRepo.update(plant.id, harvest)

  resultToast(
    'Ernte aktualisiert',
    'aktualisieren der Ernte',
    result,
  )

  if (!result.ok) {
    console.error('[PlantHarvestSession.save]:', result.error)
    return
  }

  emit('updated')
}

function getHarvestData(): Harvest {
  const convertNum = (v: any) => typeof v === 'number' ? v : undefined
  const convertStr = (v: any) => typeof v === 'string' ? v !== '' ? v : undefined : undefined

  const baseData: WithId<HarvestBase, number> = {
    id: harvest.id,
    weight: convertNum(weight.value),
    container: convertStr(container.value),
    info: convertStr(info.value),
    timestamp: dayjs(date.value).valueOf(),
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

function resetHarvestForm() {
  const baseData = harvest.type === 'session'
    ? { isSessionForm: true, state: harvest.state }
    : { isSessionForm: false }

  resetForm({
    values: {
      ...baseData,
      date: dayjs(new Date(harvest.timestamp)).format('YYYY-MM-DDTHH:mm'),
      weight: harvest.weight,
      container: harvest.container,
      info: harvest.info,
    },
  })
}

onMounted(resetHarvestForm)
</script>
