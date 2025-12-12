<template>
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
</template>

<script lang="ts" setup>
import {
  Info as IconInfo,
} from 'lucide-vue-next'
import { computed, h, ref } from 'vue'
import IAlert from './ui/IAlert.vue'
import IPopper from './ui/IPopper.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

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
</script>
