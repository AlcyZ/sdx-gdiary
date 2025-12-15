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
import SettingsDataExport from '../components/SettingsDataExport.vue'
import SettingsDataImport from '../components/SettingsDataImport.vue'
import SettingsDebug from '../components/SettingsDebug.vue'
import SettingsSeed from '../components/SettingsSeed.vue'
import SettingsUpdate from '../components/SettingsUpdate.vue'
import { usePageLayout } from '../composables/usePageLayout.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

usePageLayout({
  dock: true,
})
</script>
