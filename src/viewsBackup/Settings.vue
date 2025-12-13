<template>
  <div class="flex flex-col gap-3 items-center justify-center flex-1 my-4">
    <SettingsDataExport />

    <SettingsDataImport />

    <SettingsUpdate />

    <div class="divider text-gray-900/30">
      Entwickler Tools
    </div>

    <SettingsSeed class="opacity-75" />

    <SettingsDebug class="opacity-75" />
  </div>
</template>

<script lang="ts" setup>
import SettingsDataExport from '../componentsBackup/SettingsDataExport.vue'
import SettingsDataImport from '../componentsBackup/SettingsDataImport.vue'
import SettingsDebug from '../componentsBackup/SettingsDebug.vue'
import SettingsSeed from '../componentsBackup/SettingsSeed.vue'
import SettingsUpdate from '../componentsBackup/SettingsUpdate.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
