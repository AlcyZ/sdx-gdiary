<template>
  <div class="flex-1 flex flex-col justify-center items-center gap-y-4">
    <ICard
      class="w-full max-w-3xl"
    >
      <ICardTitle class="text-2xl">
        Daten exportieren
      </ICardTitle>

      <p class="my-5">
        Exportiere alle deine Daten zu einer JSON-Datei. Die Datei kann bei Bedarf einfach wieder importiert werden.
        Auch praktisch, um Backups von seinen Daten zu erhalten.
      </p>

      <IBtn
        variant="neutral"
        class="w-full"
        @click="exportData"
      >
        Exportieren
      </IBtn>
    </ICard>

    <ICard
      class="w-full max-w-3xl"
    >
      <ICardTitle class="text-2xl">
        Daten importieren
      </ICardTitle>

      <p class="my-3 text-center">
        Wähle eine Datei aus und importiere die Daten.<br>
        <span class="text-error">ACHTUNG: Dabei werden alle vorhandenen Daten entfernt</span>
      </p>

      <IInputFileUpload
        v-model="importFile"
      />

      <IBtn
        variant="neutral"
        class="w-full"
        :disabled="importFile === undefined"
        @click="importData"
      >
        Importieren
      </IBtn>
    </ICard>

    <ICard
      class="w-full max-w-3xl"
    >
      <ICardTitle class="text-2xl">
        Testdaten importieren
      </ICardTitle>

      <p class="my-5">
        Bei einen Klick auf den Button werden 6 zufällige Pflanzen, sowie das Hesi-Starterpack, und BioBizz CalMag/PH+-
        angelegt.
      </p>

      <IBtn
        variant="neutral"
        class="w-full"
        disabled
        @click="seed"
      >
        Seed
      </IBtn>
    </ICard>
  </div>
</template>

<script lang="ts" setup>
import type { IDBPDatabase } from 'idb'
import dayjs from 'dayjs'
import { ref } from 'vue'
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'
import ICardTitle from '../components/ui/ICardTitle.vue'
import IInputFileUpload from '../components/ui/IInputFileUpload.vue'
import { useToast } from '../composables/useToast.ts'
import {
  getDb,
  TABLE_FERTILIZERS,
  TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_SUBSTRATES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS,
  TABLE_WATERING_SCHEMAS,
  TABLES_DB,
} from '../modules/db'
import DevSeeder from '../seeder/devSeeder.ts'
import { useFertilizerStore } from '../stores/fertilizerStore.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'
import { downloadJsonString, safeParseJson, wrapPromiseSafe } from '../util.ts'

interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()
const fertilizerStore = useFertilizerStore()
const wateringSchemaStore = useWateringSchemaStore()

const { showToast, toast } = useToast()
const importFile = ref<File | undefined>()

async function seed() {
  const count = 6
  const seeder = await DevSeeder.create()

  await seeder.seed(count)
  showToast({
    message: 'Testdatensätze erfolgreich erstellt!',
    variant: 'success',
    duration: 2000,
  })
}

async function exportData() {
  const db = await getDb()

  const tx = db.transaction(TABLES_DB)

  const storePlants = tx.objectStore(TABLE_PLANTS)
  const storePlantImages = tx.objectStore(TABLE_PLANT_IMAGES)
  const storePlantSubstrates = tx.objectStore(TABLE_PLANT_SUBSTRATES)
  const storePlantPhases = tx.objectStore(TABLE_PLANT_PHASES)
  const storePlantWateringLogs = tx.objectStore(TABLE_PLANT_WATERING_LOGS)
  const storeFertilizers = tx.objectStore(TABLE_FERTILIZERS)
  const storeWateringSchema = tx.objectStore(TABLE_WATERING_SCHEMAS)
  const storeFertilizerWateringSchema = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)

  const results = await Promise.all([
    storePlants.getAll().then(plants => ({ plants })),
    storePlantImages.getAll().then(plantImages => ({ plantImages })),
    storePlantSubstrates.getAll().then(plantSubstrates => ({ plantSubstrates })),
    storePlantPhases.getAll().then(plantPhases => ({ plantPhases })),
    storePlantWateringLogs.getAll().then(plantWateringLogs => ({ plantWateringLogs })),
    storeFertilizers.getAll().then(fertilizers => ({ fertilizers })),
    storeWateringSchema.getAll().then(wateringSchema => ({ wateringSchema })),
    storeFertilizerWateringSchema.getAll().then(fertilizerWateringSchema => ({ fertilizerWateringSchema })),
  ])
  const data = Object.assign({}, ...results)
  const content = JSON.stringify(data)

  const prefix = dayjs().format('YYYY-MM-DD_HH:mm')
  const filename = `${prefix}_grow_diary.json`

  downloadJsonString(content, filename)
}

interface ImportExportData {
  [TABLE_PLANTS]: Array<any>
  [TABLE_PLANT_IMAGES]: Array<any>
  [TABLE_PLANT_SUBSTRATES]: Array<any>
  [TABLE_PLANT_PHASES]: Array<any>
  [TABLE_PLANT_WATERING_LOGS]: Array<any>
  [TABLE_FERTILIZERS]: Array<any>
  [TABLE_WATERING_SCHEMAS]: Array<any>
  [TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA]: Array<any>
}

function isImportExportData(value: unknown): value is ImportExportData {
  if (typeof value !== 'object' || value === null)
    return false

  const obj = value as Record<string, unknown>

  const requiredKeys = [
    TABLE_PLANTS,
    TABLE_PLANT_IMAGES,
    TABLE_PLANT_SUBSTRATES,
    TABLE_PLANT_PHASES,
    TABLE_PLANT_WATERING_LOGS,
    TABLE_FERTILIZERS,
    TABLE_WATERING_SCHEMAS,
    TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  ]

  // check all keys exist and are arrays
  return requiredKeys.every(key => Array.isArray(obj[key]))
}

async function truncateDatabase(
  db: IDBPDatabase,
) {
  return wrapPromiseSafe(async () => {
    const tx = db.transaction(TABLES_DB, 'readwrite')
    for (const storeName of TABLES_DB) {
      tx.objectStore(storeName).clear()
    }
    await tx.done
  }, { method: 'DevSeed.truncateDatabase', message: 'Failed to cleanup database' })
}

async function importDataSafe(
  data: ImportExportData,
  db: IDBPDatabase,
) {
  return wrapPromiseSafe(async () => {
    const tx = db.transaction(TABLES_DB, 'readwrite')

    const storePlants = tx.objectStore(TABLE_PLANTS)
    const storePlantImages = tx.objectStore(TABLE_PLANT_IMAGES)
    const storePlantSubstrates = tx.objectStore(TABLE_PLANT_SUBSTRATES)
    const storePlantPhases = tx.objectStore(TABLE_PLANT_PHASES)
    const storePlantWateringLogs = tx.objectStore(TABLE_PLANT_WATERING_LOGS)
    const storeFertilizers = tx.objectStore(TABLE_FERTILIZERS)
    const storeWateringSchema = tx.objectStore(TABLE_WATERING_SCHEMAS)
    const storeFertilizerWateringSchema = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)

    data[TABLE_PLANTS].forEach(row => storePlants.add(row))
    data[TABLE_PLANT_IMAGES].forEach(row => storePlantImages.add(row))
    data[TABLE_PLANT_SUBSTRATES].forEach(row => storePlantSubstrates.add(row))
    data[TABLE_PLANT_PHASES].forEach(row => storePlantPhases.add(row))
    data[TABLE_PLANT_WATERING_LOGS].forEach(row => storePlantWateringLogs.add(row))
    data[TABLE_FERTILIZERS].forEach(row => storeFertilizers.add(row))
    data[TABLE_WATERING_SCHEMAS].forEach(row => storeWateringSchema.add(row))
    data[TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA].forEach(row => storeFertilizerWateringSchema.add(row))

    await tx.done
  }, { method: 'DevSeed.importDataSafe', message: 'Import failed', payload: { data } })
}

async function importData() {
  if (!importFile.value)
    return

  const content = await importFile.value.text()
  const parseResult = safeParseJson(content, isImportExportData)

  if (!parseResult.ok) {
    toast('Ungültige Datei für den Import verwendet!', 'error')
    return
  }

  const db = await getDb()
  await truncateDatabase(db)

  const importResult = await importDataSafe(parseResult.value, db)

  if (importResult.ok) {
    await syncStores()
    toast('Daten erfolgreich importiert', 'success')
  }
  else {
    toast('Aufgrund eines Fehler konnten die Daten nicht importiert werden', 'error')
    console.error('Failed to import data:', importResult)
  }
}

async function syncStores() {
  await Promise.all([
    plantStore.syncPlants(),
    fertilizerStore.syncFertilizers(),
    wateringSchemaStore.syncWateringSchemas(),
  ])
}
</script>
