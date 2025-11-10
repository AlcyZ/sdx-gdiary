<template>
  <div class="flex-1 flex flex-col justify-center items-center gap-y-4">
    <ICard
      class="w-full max-w-3xl"
    >
      <ICardTitle class="text-2xl">
        Daten exportieren
      </ICardTitle>

      <p class="my-5">
        Exportiere alle deine Daten zu einer JSON-Datei. Die Datei kann bei Bedarf einfach wieder importiert werden.
        Auch praktisch, um Backups von seinen Daten zu erhalten.
      </p>

      <IBtn
        variant="neutral"
        class="w-full"
        @click="exportData"
      >
        Exportieren
      </IBtn>
    </ICard>

    <ICard
      class="w-full max-w-3xl"
    >
      <ICardTitle class="text-2xl">
        Testdaten importieren
      </ICardTitle>

      <p class="my-5">
        Bei einen Klick auf den Button werden 6 zufällige Pflanzen, sowie das Hesi-Starterpack, und BioBizz CalMag/PH+-
        angelegt.
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
import {
  getDb, TABLE_FERTILIZERS, TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA,
  TABLE_PLANT_IMAGES,
  TABLE_PLANT_PHASES,
  TABLE_PLANT_SUBSTRATES,
  TABLE_PLANT_WATERING_LOGS,
  TABLE_PLANTS, TABLE_WATERING_SCHEMAS, TABLES_DB
} from "../modules/db";
import {downloadJsonString} from "../util.ts";
import dayjs from "dayjs";

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

async function exportData() {
  const db = await getDb()

  const tx = db.transaction(TABLES_DB)

  const storePlants = tx.objectStore(TABLE_PLANTS)
  const storePlantImages = tx.objectStore(TABLE_PLANT_IMAGES)
  const storePlantSubstrates = tx.objectStore(TABLE_PLANT_SUBSTRATES)
  const storePlantPhases = tx.objectStore(TABLE_PLANT_PHASES)
  const storePlantWateringLogs = tx.objectStore(TABLE_PLANT_WATERING_LOGS)
  const storeFertilizers = tx.objectStore(TABLE_FERTILIZERS)
  const storeWateringSchema = tx.objectStore(TABLE_WATERING_SCHEMAS)
  const storeFertilizerWateringSchema = tx.objectStore(TABLE_PIVOT_FERTILIZER_WATERING_SCHEMA)

  const results = await Promise.all([
    storePlants.getAll().then(plants => ({ plants })),
    storePlantImages.getAll().then(plantImages => ({ plantImages })),
    storePlantSubstrates.getAll().then(plantSubstrates => ({ plantSubstrates })),
    storePlantPhases.getAll().then(plantPhases => ({ plantPhases })),
    storePlantWateringLogs.getAll().then(plantWateringLogs => ({ plantWateringLogs })),
    storeFertilizers.getAll().then(fertilizers => ({ fertilizers })),
    storeWateringSchema.getAll().then(wateringSchema => ({ wateringSchema })),
    storeFertilizerWateringSchema.getAll().then(fertilizerWateringSchema => ({ fertilizerWateringSchema })),
  ])
  const data = Object.assign({}, ...results)
  const content = JSON.stringify(data)

  const prefix = dayjs().format('YYYY-MM-DD_HH:mm')
  const filename = `${prefix}_grow_diary.json`

  downloadJsonString(content, filename)
}
</script>
