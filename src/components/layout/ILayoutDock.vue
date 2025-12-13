<template>
  <div class="shrink-0 flex border border-subtle bg-white">
    <ILayoutDockItem
      v-for="(dock, i) in docks"
      :key="i"
      :dock
    />
  </div>
</template>

<script lang="ts" setup>
import type { DockItem } from '../../types'
import { markRaw, ref } from 'vue'
import IconGalleryThumbnail from '../../icons/IconGalleryThumbnail.vue'
import IconLabResearch from '../../icons/IconLabResearch.vue'
import IconPottedPlant from '../../icons/IconPottedPlant.vue'
import IconSettings from '../../icons/IconSettings.vue'
import ILayoutDockItem from './ILayoutDockItem.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const docks = ref<Array<DockItem>>([
  {
    label: 'Pflanzen',
    icon: markRaw(IconPottedPlant),
    to: '/plants',
  },
  {
    label: 'Dünger',
    icon: markRaw(IconLabResearch),
    to: '/nutrients',
  },
  {
    label: 'Galerie',
    icon: markRaw(IconGalleryThumbnail),
    to: '/gallery',
  },
  {
    label: 'Einstellungen',
    icon: markRaw(IconSettings),
    to: '/settings',
  },
])
</script>
