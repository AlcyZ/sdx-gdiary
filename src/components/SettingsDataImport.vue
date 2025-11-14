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
import { AlertTriangle as IconAlert, Download as IconImport } from 'lucide-vue-next'
import { ref } from 'vue'
import { useToast } from '../composables/useToast.ts'
import BackupService from '../modules/backup/backup_service.ts'
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

const plantStore = usePlantStore()
const fertilizerStore = useFertilizerStore()
const wateringSchemaStore = useWateringSchemaStore()

const { toast } = useToast()
const importFile = ref<File | undefined>()

const isLoading = ref(false)

async function importData() {
  if (!importFile.value)
    return

  isLoading.value = true
  const service = await BackupService.create()
  const result = await service.importBackup(importFile.value)
  isLoading.value = false

  if (!result.ok) {
    toast('Es ist ein Fehler beim importieren des Backups aufgetreten', 'error')
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
