<template>
  <SettingsCard
    title="Daten importieren"
    :icon="IconImport"
  >
    <p class="mt-4">
      Wähle eine Datei aus und importiere die Daten.<br>
    </p>

    <IAlert
      variant="warning"
      outline
      vertical
    >
      <div class="flex items-center justify-center">
        <IconAlert class="mr-1" />
        Dabei werden alle vorhandenen Daten entfernt!
      </div>
    </IAlert>

    <IInputFileUpload
      v-model="importFile"
      label="Klicken Sie hier, um Datei zu wählen, oder ziehen Sie die .ZIP-Datei hierher."
      accept=".zip,application/zip"
    />

    <div class="flex space-x-6">
      <div
        v-for="(item, i) in versions"
        :key="i"
      >
        <label class="flex items-center">
          <span class="mr-2">v{{ item }}</span>
          <input
            v-model="version"
            type="radio"
            class="radio"
            name="import-version"
            :value="item"
          >
        </label>
      </div>
    </div>

    <IBtn
      variant="secondary"
      class="w-full mt-4"
      :disabled="importFile === undefined"
      :loading="isLoading"
      loading-type="ring"
      @click="importData"
    >
      Importieren
    </IBtn>
  </SettingsCard>
</template>

<script lang="ts" setup>
import type BackupService from '../modules/backup/backup_service.ts'
import type { ImportVersion } from '../modules/backup/types'
import { AlertTriangle as IconAlert, Download as IconImport } from 'lucide-vue-next'
import { inject, ref } from 'vue'
import { useToast } from '../composables/useToast.ts'
import { SERVICE_BACKUP } from '../di_keys.ts'
import ImportBackupError from '../modules/backup/import_backup_error.ts'
import { useFertilizerStore } from '../stores/fertilizerStore.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import { useWateringSchemaStore } from '../stores/wateringSchemaStore.ts'
import SettingsCard from './SettingsCard.vue'
import IAlert from './ui/IAlert.vue'
import IBtn from './ui/IBtn.vue'
import IInputFileUpload from './ui/IInputFileUpload.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const backupService = inject(SERVICE_BACKUP) as BackupService

const plantStore = usePlantStore()
const fertilizerStore = useFertilizerStore()
const wateringSchemaStore = useWateringSchemaStore()

const { toast } = useToast()
const importFile = ref<File | undefined>()

const isLoading = ref(false)

const versions = ref<Array<ImportVersion>>(['0.2', '0.1'])
const version = ref<ImportVersion>('0.2')

async function importData() {
  if (!importFile.value)
    return

  isLoading.value = true
  const result = await backupService.importBackup(importFile.value, version.value)
  isLoading.value = false

  if (!result.ok) {
    const errorMessage = result.error.isCode(ImportBackupError.CODE_INVALID_BACKUP_DATA)
      ? 'Das Backup enthält ein ungültiges Datenformat. Bitte versuche es mit einer anderen Version erneut.'
      : 'Es ist ein Fehler beim importieren des Backups aufgetreten.'

    toast(errorMessage, 'error', 3000)
    result.error.log()
    return
  }

  toast('Backup erfolgreich importiert', 'success')
  await syncStores()
}

async function syncStores() {
  await Promise.all([
    plantStore.syncPlants(),
    fertilizerStore.syncFertilizers(),
    wateringSchemaStore.syncWateringSchemas(),
  ])
}
</script>
