<template>
  <LayoutDock>
    <div class="flex items-center justify-center flex-1">
      <IAlert
        variant="warning"
        class="alert-vertical sm:alert-horizontal"
        soft
      >
        <IconNotFound />

        <div>
          <h2 class="text-xl font-semibold">
            404 - Seite nicht gefunden
          </h2>
          <p class="text-xs opacity-60">
            Die Seite, die du suchst, existiert nicht.
          </p>
        </div>

        <IBtn
          class="w-full"
          ghost
          @click="$router.back()"
        >
          Zurück
        </IBtn>
      </IAlert>
    </div>
  </LayoutDock>
</template>

<script lang="ts" setup>
import {
  CircleOff as IconNotFound,
} from 'lucide-vue-next'
import IAlert from '../componentsBackup/ui/IAlert.vue'
import IBtn from '../componentsBackup/ui/IBtn.vue'
import LayoutDock from '../layouts/LayoutDock.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
