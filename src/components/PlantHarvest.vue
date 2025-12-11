<template>
  <ICard
    class="w-full max-w-2xl"
    class-actions="justify-between"
  >
    <div class="flex items-center justify-between">
      <ICardTitle class="text-3xl">
        Pflanze ernten
      </ICardTitle>

      <IInputDatetime
        v-model="date"
        open-via-label
      />
    </div>

    <div>
      <div class="flex items-center">
        <ISwap
          v-model="sessionForm"
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
          class="ml-2 text-gray-500 cursor-pointer"
          @click="sessionForm = !sessionForm"
        >
          Jetzt im Modus: "<span class="font-semibold">{{ textMode }}</span>"
        </span>
      </div>

      <div
        class="text-xs text-gray-400 pl-8"
        @click="sessionForm = !sessionForm"
      >
        (Klicken zum wechseln)
      </div>
    </div>

    <IAlert
      variant="info"
      soft
      class="my-2"
    >
      <IPopper placement="bottom-start">
        <IconInfo class="stroke-info" />

        <template #content>
          <component
            :is="htmlLongInfo"
            class="bg-gray-50 shadow-sm inset-shadow-base-300 px-9 py-3"
          />
        </template>
      </IPopper>

      <div>
        <h3 class="font-semibold">
          {{ textInfoTitle }}:
        </h3>
        <component :is="htmlInfo" class="text-xs" />
      </div>
    </IAlert>

    <HarvestSessionForm
      v-if="sessionForm"
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

    <template #actions>
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
    </template>
  </ICard>
</template>

<script lang="ts" setup>
import type HarvestRepository from '../modules/harvest/harvest_repository.ts'
import type { NewHarvest, NewHarvestBase } from '../modules/harvest/types'
import type { Plant } from '../modules/plants/types'
import {
  BookCheck as IconFinishForm,
  Info as IconInfo,
  Save as IconSave,
  ClipboardClock as IconSessionForm,
} from 'lucide-vue-next'
import { computed, h, inject, ref } from 'vue'
import { useHarvestSessionForm } from '../composables/useHarvestSessionForm.ts'
import { useToast } from '../composables/useToast.ts'
import { REPO_HARVEST } from '../di_keys.ts'
import HarvestFinishForm from './HarvestFinishForm.vue'
import HarvestSessionForm from './HarvestSessionForm.vue'
import IAlert from './ui/IAlert.vue'
import IBtn from './ui/IBtn.vue'
import ICard from './ui/ICard.vue'
import ICardTitle from './ui/ICardTitle.vue'
import IInputDatetime from './ui/IInputDatetime.vue'
import IPopper from './ui/IPopper.vue'
import ISwap from './ui/ISwap.vue'
import ISwapOff from './ui/ISwapOff.vue'
import ISwapOn from './ui/ISwapOn.vue'

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
  errors,
  hasFormErrors,
  validate,
} = useHarvestSessionForm()

const { toast } = useToast()

const TEXT_MODE_SESSION = 'Session protokollieren'
const TEXT_MODE_FINISH = 'Ernte abschließen'

const TEXT_INFO_TITLE_SESSION = 'Fortschritt protokollieren'
const TEXT_INFO_TITLE_FINISH = 'Ernte abschließen'

const HTML_INFO_SESSION = h('p', {}, [
  'Trage den aktuellen ',
  h('span', { class: 'font-semibold' }, 'Trocknungsgrad'),
  ' (Pflicht) und optional das Gewicht des in dieser Session bearbeiteten Materials ein.',
])

const HTML_INFO_FINISH = h('p', {}, [
  'Trage hier das ',
  h('span', { class: 'font-semibold' }, 'finale Gesamt-Trockengewicht'),
  ' der Pflanze ein. Nach dem Speichern gilt die Pflanze als fertig geerntet.',
])

const HTML_INFO_LONG_SESSION = h('div', [
  h('h2', { class: 'font-bold text-xl' }, 'Protokollierung einer Ernte-Session'),

  h('p', { class: 'my-4 text-sm' }, [
    'Nutze diesen Modus, um die Ernte festzuhalten, die ',
    h('span', { class: 'font-semibold' }, 'heute'),
    ' oder in einem bestimmten Arbeitsschritt bearbeitet wurde (z.B. Trimmen, Aufhängen zum Trocknen, Einlagern).',
  ]),

  h('ul', { class: 'space-y-2' }, [
    h('li', {}, [
      h('span', { class: 'font-semibold' }, 'Zweck:'),
      ' Dient der ',
      h('span', { class: 'font-semibold' }, 'regelmäßigen Protokollierung'),
      ' des Trocknungsfortschritts und der Mengenverwaltung.',
    ]),

    h('li', {}, [
      h('span', { class: 'font-semibold' }, 'Trocknungsgrad:'),
      ' Der ',
      h('span', { class: 'font-semibold' }, 'Trocknungsgrad'),
      ' ist ein Pflichtfeld, da er den aktuellen Zustand des Materials beschreibt.',
    ]),

    h('li', {}, [
      h('span', { class: 'font-semibold' }, 'Gewicht:'),
      ' Das eingegebene Gewicht bezieht sich nur auf das Material, das ',
      h('span', { class: 'font-semibold' }, 'in dieser Session'),
      ' verarbeitet wurde (z.B. frisch getrimmtes Nassgewicht).',
    ]),
  ]),
])

const HTML_INFO_LONG_FINISH = h('div', [
  h('h2', { class: 'font-bold text-xl' }, 'Finaler Abschluss der Ernte'),

  h('p', { class: 'my-4 text-sm' }, [
    'Dies ist der ',
    h('span', { class: 'font-semibold' }, 'letzte und abschließende Eintrag'),
    ' für diese Pflanze. Hier wird das finale Ergebnis dokumentiert, bevor die Pflanze archiviert wird.',
  ]),

  h('ul', { class: 'space-y-2' }, [
    h('li', {}, [
      h('span', { class: 'font-semibold' }, 'Zweck:'),
      ' Protokollierung des ',
      h('span', { class: 'font-semibold' }, 'Endgewichts'),
      ' und des letzten, gültigen Trocknungsgrads.',
    ]),

    h('li', {}, [
      h('span', { class: 'font-semibold' }, 'Gewicht:'),
      ' Trage hier das ',
      h('span', { class: 'font-semibold' }, 'Gesamt-Trockengewicht'),
      ' der gesamten Pflanze ein.',
    ]),

    h('li', {}, [
      h('span', { class: 'font-semibold' }, 'Hinweis:'),
      ' Möchtest du lediglich einen laufenden Arbeitsschritt (z.B. eine weitere Trocknungsmessung) protokollieren, wechsle bitte zum Modus „',
      h('span', { class: 'font-semibold' }, 'Session protokollieren'),
      '“.',
    ]),
  ]),
])

const sessionForm = ref(true)

const textMode = computed(() => sessionForm.value
  ? TEXT_MODE_SESSION
  : TEXT_MODE_FINISH,
)
const textInfoTitle = computed(() => sessionForm.value
  ? TEXT_INFO_TITLE_SESSION
  : TEXT_INFO_TITLE_FINISH,
)
const htmlInfo = computed(() => sessionForm.value
  ? HTML_INFO_SESSION
  : HTML_INFO_FINISH,
)
const htmlLongInfo = computed(() => sessionForm.value
  ? HTML_INFO_LONG_SESSION
  : HTML_INFO_LONG_FINISH,
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
  const baseData: NewHarvestBase = {
    weight: weight.value,
    container: container.value,
    info: info.value,
    date: date.value,
  }

  return sessionForm.value
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
