<template>
  <div class="flex-1 flex justify-center items-center">
    <ICard
      class="w-full max-w-3xl"
    >
      <ICardTitle class="text-2xl">
        Testdaten importieren
      </ICardTitle>

      <p class="my-5">
        Über den Seed Button kannst du Testdaten importieren. Dann werden 6 Pflanzen, sowie ein paar Dünger erstellt.
      </p>

      <IBtn
        variant="neutral"
        class="w-full"
        @click="seed"
      >
        Seed
      </IBtn>
    </ICard>
  </div>
</template>

<script lang="ts" setup>
import IBtn from '../components/ui/IBtn.vue'
import ICard from '../components/ui/ICard.vue'
import ICardTitle from '../components/ui/ICardTitle.vue'
import { useToast } from '../composables/useToast.ts'
import DevSeeder from '../seeder/devSeeder.ts'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const { showToast } = useToast()

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
