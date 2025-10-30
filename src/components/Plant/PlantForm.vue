<template>
  <ICard class="max-w-lg w-full">
    <h1>Neue Pflanze erstellen</h1>

    <InputText
      v-model="form.strain"
      label="Name der Sorte"
      :error="errorMessage?.strain"
      required
    />

    <label class="floating-label">
      <input type="text" placeholder="Medium" class="input input-md" />
      <span>Medium</span>
      <span>as</span>
    </label>

    <InputText
      v-model="form.name"
      label="Name der Pflanze"
    />

    <InputDate
      v-model="form.poppedAt"
      label="Datum an dem der Samen sprießt"
      :error="errorMessage?.poppedAt"
    />

    <InputPhoto
      v-model="form.image"
      label="Bild der Pflanze"
    />

    <div v-if="errorMessage?.image" class="text-xs text-red-400 my-2">
      {{ errorMessage.image }}
    </div>

    <div>
      <BtnPrimary
        @click="save"
      >
        Speichern
      </BtnPrimary>
    </div>
  </ICard>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue'
import { toast } from 'vue3-toastify'
import { savePlant } from '../../modules/plants'
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

const errorMessage = ref<SavePlantError | null>(null)
const hasError = computed((): boolean => errorMessage.value !== null)

async function save() {
  const result = await savePlant(form.value)
  errorMessage.value = null

  if (result.ok) {
    toast('Pflanze gespeichert!', {
      position: toast.POSITION.BOTTOM_CENTER,
    })
    form.value = {
      strain: '',
      image: '',
      poppedAt: '',
      name: '',
    }
    return
  }

  errorMessage.value = result.error
}
</script>
