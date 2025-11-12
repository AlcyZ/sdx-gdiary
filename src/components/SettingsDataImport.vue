<template>
  <SettingsCard
    title="Daten importieren"
  >
    <p class="my-3 text-center">
      Wähle eine Datei aus und importiere die Daten.<br>
      <span class="text-error">ACHTUNG: Dabei werden alle vorhandenen Daten entfernt</span>
    </p>

    <IInputFileUpload
      v-model="importFile"
      label="Drag & Drop Backup ZIP"
      accept=".zip,application/zip"
    />

    <IBtn
      variant="neutral"
      class="w-full"
      :disabled="importFile === undefined"
      @click="importData"
    >
      Importieren
    </IBtn>
  </SettingsCard>
</template>

<script lang="ts" setup>
import type { IDBPDatabase } from 'idb'
import { ref } from 'vue'
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
import { useFertilizerStore } from '../stores/fertilizerStore.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'
import { safeAsync, safeParseJson } from '../util.ts'
import SettingsCard from './SettingsCard.vue'
import IBtn from './ui/IBtn.vue'
import IInputFileUpload from './ui/IInputFileUpload.vue'

interface Props {

}
interface Emits {

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

defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()
const fertilizerStore = useFertilizerStore()
const wateringSchemaStore = useWateringSchemaStore()

const { toast } = useToast()
const importFile = ref<File | undefined>()

const isDev = ref(true)

function importData () {
  toast('so los!', 'warning')
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

async function importDataBackup() {
  if (isDev.value) {
    toast('Needs to be refactored!!', 'warning')
    return
  }

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

async function truncateDatabase(
  db: IDBPDatabase,
) {
  return safeAsync(async () => {
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
  return safeAsync(async () => {
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

async function syncStores() {
  await Promise.all([
    plantStore.syncPlants(),
    fertilizerStore.syncFertilizers(),
    wateringSchemaStore.syncWateringSchemas(),
  ])
}
</script>
