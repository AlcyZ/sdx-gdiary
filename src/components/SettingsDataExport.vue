<template>
  <SettingsCard
    title="Daten exportieren"
  >
    <p class="my-5">
      Exportiere alle deine Daten zu einer JSON-Datei. Die Datei kann bei Bedarf einfach wieder importiert werden. Auch
      praktisch, um Backups von seinen Daten zu erhalten.
    </p>

    <IBtn
      variant="neutral"
      class="w-full"
      @click="exportData"
    >
      Exportieren
    </IBtn>
  </SettingsCard>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import { useToast } from '../composables/useToast.ts'
import BackupService from '../modules/backup/backup_service.ts'
import SettingsCard from './SettingsCard.vue'
import IBtn from './ui/IBtn.vue'

interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { toast } = useToast()

async function exportData() {
  const service = await BackupService.create()
  const result = await service.createBackupZip()
  if (!result.ok)
    return

  const prefix = dayjs().format('YYYY-MM-DD_HH:mm')
  const filename = `${prefix}_grow_diary.zip`

  const url = URL.createObjectURL(result.value)

  const a = document.createElement('a')
  a.href = url
  a.download = filename

  a.click()
  URL.revokeObjectURL(url)

  toast('Backup erfolgreich erstellt', 'success')
}
</script>
