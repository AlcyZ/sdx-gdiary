<template>
  <div
    class="rounded-box px-8 py-4 border-dotted border border-base-200 bg-sky-50/50"
  >
    <h3 class="text-xl font-semibold">
      Erstelle dein erstes Zuchtschema
    </h3>

    <p class="text-sm text-gray-400 leading-relaxed mt-4">
      Ein Schema speichert die empfohlene Dosierung für Phasen wie Wachstum oder Blüte. Es ist optional, vereinfacht
      aber dein Gießen.
    </p>

    <RouterLink
      class="text-accent/70 text-sm underline cursor-pointer flex items-center mt-2"
      :to="{ name: 'nutrients.schema.add' }"
    >
      <IconPlus :size="20" />
      Neues Schema anlegen
    </RouterLink>
  </div>
</template>

<script lang="ts" setup>
import {
  Plus as IconPlus,
} from 'lucide-vue-next'

interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
