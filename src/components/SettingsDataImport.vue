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
import { ref } from 'vue'
import { useToast } from '../composables/useToast.ts'
import BackupService from '../modules/backup/backup_service.ts'

import { useFertilizerStore } from '../stores/fertilizerStore.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'
import SettingsCard from './SettingsCard.vue'
import IBtn from './ui/IBtn.vue'
import IInputFileUpload from './ui/IInputFileUpload.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const plantStore = usePlantStore()
const fertilizerStore = useFertilizerStore()
const wateringSchemaStore = useWateringSchemaStore()

const { toast } = useToast()
const importFile = ref<File | undefined>()

async function importData() {
  if (!importFile.value)
    return

  const service = await BackupService.create()
  const result = await service.importBackup(importFile.value)

  if (result.ok) {
    toast('Backup erfolgreich importiert', 'success')
    await syncStores()
    return
  }

  toast('Es ist ein Fehler beim importieren des Backups aufgetreten', 'error')
  console.error('Error:', result)
}

async function syncStores() {
  await Promise.all([
    plantStore.syncPlants(),
    fertilizerStore.syncFertilizers(),
    wateringSchemaStore.syncWateringSchemas(),
  ])
}
</script>
