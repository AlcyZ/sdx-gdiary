<template>
  <motion.ul
    class="flex flex-col gap-3 items-center justify-center flex-1 my-4 p-4"
    :variants="fadeLeft.list"
    initial="from"
    animate="to"
  >
    <motion.li
      class="w-full"
      :variants="fadeLeft.item"
    >
      <SettingsDataExport />
    </motion.li>
    <motion.li
      class="w-full"
      :variants="fadeLeft.item"
    >
      <SettingsDataImport />
    </motion.li>
    <motion.li
      class="w-full"
      :variants="fadeLeft.item"
    >
      <SettingsUpdate />
    </motion.li>
    <motion.li
      class="w-full"
      :variants="fadeLeft.item"
    >
      <div class="divider text-gray-900/30">
        Entwickler Tools
      </div>
    </motion.li>
    <motion.li
      class="w-full"
      :variants="fadeLeft.item"
    >
      <SettingsSeed class="opacity-75" />
    </motion.li>
    <motion.li
      class="w-full"
      :variants="fadeLeft.item"
    >
      <SettingsDebug class="opacity-75" />
    </motion.li>
  </motion.ul>
</template>

<script lang="ts" setup>
import { motion } from 'motion-v'
import SettingsDataExport from '../components/SettingsDataExport.vue'
import SettingsDataImport from '../components/SettingsDataImport.vue'
import SettingsDebug from '../components/SettingsDebug.vue'
import SettingsSeed from '../components/SettingsSeed.vue'
import SettingsUpdate from '../components/SettingsUpdate.vue'
import { usePageLayout } from '../composables/usePageLayout.ts'
import useStaggerAnimation from '../composables/useStaggerAnimation.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

usePageLayout({
  dock: true,
})
const { fadeLeft } = useStaggerAnimation()
</script>
