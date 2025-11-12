<template>
  <LayoutDock>
    <div class="flex flex-col gap-3 items-center justify-center flex-1 my-4">
      <SettingsUpdate />

      <SettingsDataExport />

      <SettingsDataImport />

      <SettingsSeed />
    </div>
  </LayoutDock>
</template>

<script lang="ts" setup>
import SettingsDataExport from '../components/SettingsDataExport.vue'
import SettingsDataImport from '../components/SettingsDataImport.vue'
import SettingsSeed from '../components/SettingsSeed.vue'
import SettingsUpdate from '../components/SettingsUpdate.vue'
import LayoutDock from '../layouts/LayoutDock.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
