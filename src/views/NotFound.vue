<template>
  <LayoutDock>
    <div class="flex items-center justify-center flex-1">
      <IAlert>
        <IconNotFound />
        <div class="text-center">
          <h2 class="text-xl font-semibold">
            404 – Seite nicht gefunden
          </h2>
          <p class="text-xs opacity-60">
            Die Seite, die du suchst, existiert nicht.
          </p>
          <IBtn
            class="w-full"
            @click="$router.back()"
          >
            Zurück
          </IBtn>
        </div>
      </IAlert>
    </div>
  </LayoutDock>
</template>

<script lang="ts" setup>
import {
  CircleOff as IconNotFound,
} from 'lucide-vue-next'
import IAlert from '../components/ui/IAlert.vue'
import IBtn from '../components/ui/IBtn.vue'
import LayoutDock from '../layouts/LayoutDock.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
