<template>
  <SettingsCard
    title="Testdaten seeden"
    :icon="IconSeed"
  >
    <p class="mt-4">
      Bei einen Klick auf den Button werden 6 zufällige Pflanzen, sowie das Hesi-Starterpack, und BioBizz CalMag/PH+-
      angelegt.
    </p>

    <IBtn
      variant="neutral"
      class="w-full mt-4"
      @click="openSeedModal"
    >
      Seed
    </IBtn>
  </SettingsCard>
</template>

<script lang="ts" setup>
import { Check as IconCheck, TestTube as IconSeed } from 'lucide-vue-next'
import { useModal } from '../composables/useModal.ts'
import { useToast } from '../composables/useToast.ts'
import DevSeeder from '../seeder/devSeeder.ts'
import SettingsCard from './SettingsCard.vue'
import IBtn from './ui/IBtn.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { showConfirmationModal } = useModal()
const { showToast } = useToast()

function openSeedModal() {
  showConfirmationModal({
    title: 'Testdaten importieren',
    text: 'Bist du sicher, dass du Testdaten importieren möchtest?',
    actions: [
      {
        label: 'Seed',
        icon: IconCheck,
        class: 'btn-primary text-base-100',
        onClick: seed,
      },
    ],
  })
}

async function seed() {
  const count = 6
  const seeder = await DevSeeder.create()

  await seeder.seed(count)
  showToast({
    message: 'Testdatensätze erfolgreich erstellt!',
    variant: 'success',
    duration: 2000,
  })
}
</script>
