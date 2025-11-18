<template>
  <SettingsCard
    title="Clean import"
    :icon="IconCode"
  >
    <p class="mt-4">
      Datenimport, bei dem die Indizes neu geschrieben werden. Hauptsächlich nützlich zur Entwicklung. <br>
      Verwende lieber die Import-Funktion oben, wenn du dir nicht sicher bist, was du machst.
    </p>

    <IAlert
      variant="warning"
      soft
    >
      <IconAlert />
      Du musst ein Backup erstellen, bevor du diese Funktion nutzt. Sie löscht alle deine Daten, was ohne Backup nicht
      rückgängig gemacht werden kann!
    </IAlert>

    <IInputFileUpload
      v-model="backupFile"
      accept=".zip,application/zip"
      label="Backup Datei via Drag & Drop oder Klick auf diesen Feld auswählen"
    />

    <IBtn
      class="w-full"
      variant="neutral"
      :disabled="!backupFile"
      @click="handleCleanImport"
    >
      Los!
    </IBtn>
  </SettingsCard>
</template>

<script lang="ts" setup>
import type BackupService from '../modules/backup/backup_service.ts'
import {
  TriangleAlert as IconAlert,
  Code2 as IconCode,
} from 'lucide-vue-next'
import { inject, ref } from 'vue'
import { useModal } from '../composables/useModal.ts'
import { useToast } from '../composables/useToast.ts'
import { SERVICE_BACKUP } from '../di_keys.ts'
import SettingsCard from './SettingsCard.vue'
import SettingsModalCleanImportDeleteDatabase from './SettingsModalCleanImportDeleteDatabase.vue'
import IAlert from './ui/IAlert.vue'
import IBtn from './ui/IBtn.vue'
import IInputFileUpload from './ui/IInputFileUpload.vue'

interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const service = inject(SERVICE_BACKUP) as BackupService

const { showModal } = useModal()
const { toast } = useToast()

const backupFile = ref<File | undefined>()

async function handleCleanImport() {
  if (!backupFile.value)
    return

  if (!await service.isDbEmpty()) {
    showDeleteDbConfirmationModal()
    return
  }

  const importResult = await service.importBackup(backupFile.value, true)
  if (!importResult.ok) {
    'log' in importResult.error && typeof importResult.error === 'function'
      ? importResult.error.log()
      : console.error(importResult.error)
    return
  }

  toast('Backup erfolgreich importiert', 'success', 1500, () => window.location.reload())
}

function showDeleteDbConfirmationModal() {
  const { close } = showModal(SettingsModalCleanImportDeleteDatabase, {
    onSubmit: async () => {
      await close()
      await service.safeDeleteDatabase()
      toast('Datenbank ist erfolgreich gelöscht worden und die Seite wird aktualisiert', 'info', 1500, () => window.location.reload())
    },
  })
}
</script>
