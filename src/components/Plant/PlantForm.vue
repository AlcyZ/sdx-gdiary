<template>
  <ICard class="max-w-lg w-full">
    <h1>Neue Pflanze erstellen</h1>

    <InputText
      v-model="form.strain"
      label="Name der Sorte"
      required
    />

    <InputText
      v-model="form.name"
      label="Name der Pflanze"
    />

    <InputDate
      v-model="form.poppedAt"
      label="Datum an dem der Samen sprießt"
    />

    <InputPhoto
      v-model="form.image"
      label="Bild der Pflanze"
    />

    <div>
      <BtnPrimary
        @click="savePlant"
      >
        Speichern
      </BtnPrimary>
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import type { ToastOptions } from 'vue3-toastify'
import { ref, toRaw } from 'vue'
import { toast } from 'vue3-toastify'
import { base64ToBlob, getDb, isBase64String, TABLE_PLANT_IMAGES, TABLE_PLANTS } from '../../modules/db'
import BtnPrimary from '../BtnPrimary.vue'
import ICard from '../ICard.vue'
import InputDate from '../InputDate.vue'
import InputPhoto from '../InputPhoto.vue'
import InputText from '../InputText.vue'

interface Props {

}
interface Emits {

}

interface FormData {
  strain: string
  name: string
  poppedAt: string
  image: string
}

defineProps<Props>()
defineEmits<Emits>()

const form = ref<FormData>({
  strain: '',
  name: '',
  poppedAt: '',
  image: '',
})

async function savePlant() {
  const db = await getDb()

  const now = (): string => (new Date()).toISOString()
  const timestamps = { createdAt: now(), updatedAt: now() }

  const plant = {
    strain: form.value.strain,
    name: form.value.name,
    poppedAt: form.value.poppedAt,
    ...timestamps,
  }

  const plantId = await db.add(TABLE_PLANTS, plant)

  if (!isBase64String(form.value.image)) {
    console.warn('[PlantForm:savePlant][Cant save plant image due to invalid base64 string]', toRaw(form))
    return
  }

  const plantImage = {
    plantId,
    image: base64ToBlob(form.value.image),
  }
  await db.add(TABLE_PLANT_IMAGES, plantImage)

  toast('Pflanze gespeichert!', {
    position: toast.POSITION.BOTTOM_CENTER,
  })
  form.value = {
    strain: '',
    image: '',
    poppedAt: '',
    name: '',
  }
}
</script>
