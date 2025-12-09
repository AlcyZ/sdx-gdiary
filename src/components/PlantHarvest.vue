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
          class="ml-2 text-gray-500"
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
          <div
            class="bg-gray-50 shadow-sm inset-shadow-base-300 px-9 py-3"
            v-html="htmlLongInfo"
          />
        </template>
      </IPopper>

      <div>
        <h3 class="font-semibold">
          {{ textInfoTitle }}:
        </h3>
        <span class="text-xs" v-html="htmlInfo" />
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
import { computed, inject, ref } from 'vue'
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

const h2 = (s: string) => `<h2 class="font-bold text-xl">${s}</h2>`
const bold = (s: string) => `<span class="font-semibold">${s}</span>`

const TEXT_MODE_SESSION = 'Session protokollieren'
const TEXT_MODE_FINISH = 'Ernte abschließen'

const TEXT_INFO_TITLE_SESSION = 'Fortschritt protokollieren'
const TEXT_INFO_TITLE_FINISH = 'Ernte abschließen'

const HTML_INFO_SESSION = `
Trage den aktuellen ${bold('Trocknungsgrad')} (Pflicht) und optional das Gewicht des in dieser Session bearbeiteten Materials ein.
`
const HTML_INFO_FINISH = `
Trage hier das ${bold('finale Gesamt-Trockengewicht')} der Pflanze ein. Nach dem Speichern gilt die Pflanze als fertig geerntet.
`

const HTML_INFO_LONG_SESSION = `
${h2('Protokollierung einer Ernte-Session')}

<p class="my-4 text-sm">Nutze diesen Modus, um die Ernte festzuhalten, die ${bold('heute')} oder in einem bestimmten Arbeitsschritt bearbeitet wurde (z.B. Trimmen, Aufhängen zum Trocknen, Einlagern).</p>

<ul class="space-y-2">
  <li>
    ${bold('Zweck:')} Dient der ${bold('regelmäßigen Protokollierung')} des Trocknungsfortschritts und der Mengenverwaltung.
  </li>
  <li>
    ${bold('Trocknungsgrad:')} Der ${bold('Trocknungsgrad')} ist ein Pflichtfeld, da er den aktuellen Zustand des Materials beschreibt.
  </li>
  <li>
    ${bold('Gewicht:')} Das eingegebene Gewicht bezieht sich nur auf das Material, das ${bold('in dieser Session')} verarbeitet wurde (z.B. frisch getrimmtes Nassgewicht).
  </li>
</ul>
`
const HTML_INFO_LONG_FINISH = `
${h2('Finaler Abschluss der Ernte')}

<p class="my-4 text-sm">Dies ist der ${bold('letzte und abschließende Eintrag')} für diese Pflanze. Hier wird das finale Ergebnis dokumentiert, bevor die Pflanze archiviert wird.</p>

<ul class="space-y-2">
  <li>
    ${bold('Zweck:')} Protokollierung des ${bold('Endgewichts')} und des letzten, gültigen Trocknungsgrads.
  </li>
  <li>
    ${bold('Gewicht:')} Trage hier das ${bold('Gesamt-Trockengewicht')} der gesamten Pflanze ein.
  </li>
  <li>
    ${bold('Hinweis:')} Möchtest du lediglich einen laufenden Arbeitsschritt (z.B. eine weitere Trocknungsmessung) protokollieren, wechsle bitte zum Modus "${bold('Session protokollieren')}".
  </li>
</ul>
`

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
