<template>
  <SettingsCard
    title="Updates installieren"
  >
    <p class="my-2">
      Hier kann die App aktualisiert werden
    </p>

    <IBtn
      variant="neutral"
      class="w-full"
      @click="updateServiceWorker"
    >
      Updates installieren
    </IBtn>
  </SettingsCard>
</template>

<script lang="ts" setup>
import { useToast } from '../composables/useToast.ts'
import SettingsCard from './SettingsCard.vue'
import IBtn from './ui/IBtn.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { toast } = useToast()

async function updateServiceWorker() {
  if ('serviceWorker' in navigator) {
    const registrations = await navigator.serviceWorker.getRegistrations()

    for (const registration of registrations) {
      await registration.update()
    }

    toast('App erfolgreich aktualisiert. Die App muss neugestartet werden, damit die Änderung funktionieren', 'success')
  }
  else {
    toast('Service worker object not available in navigator!', 'warning')
  }
}
</script>
