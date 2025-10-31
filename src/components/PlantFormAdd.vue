<template>
  <div class="flex items-center justify-center">
    <div class="card bg-base-100 shadow-sm w-full max-w-xl">
      <div class="card-body">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-bold">
            Neue Pflanze anlegen
          </h1>
        </div>

        <div class="space-y-3">
          <InputTextFloat
            v-model="form.strain"
            label="Welche Sorte ist die Pflanze?"
            :error="form.error?.strain"
            required
          />

          <InputTextFloat
            v-model="form.name"
            label="Wie heißt deine Pflanze?"
            :error="form.error?.name"
          />

          <InputTextFloat
            v-model="form.poppedAt"
            label="Wann ist sie eingepflanzt worden?"
            type="date"
            :error="form.error?.poppedAt"
          />

          <InputPhoto
            v-model="form.image"
            label="Füg ein Bild deiner Pflanze hinzu"
            :error="form.error?.image"
          />
        </div>

        <div>
          <button
            class="btn btn-primary w-full"
            :disabled="loading"
            @click="save"
          >
            Speichern
          </button>
        </div>

        <!--        <IToast -->
        <!--          message="Foo bar" -->
        <!--          variant="info" -->
        <!--        /> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import type { FormError } from '../types'
import { ref } from 'vue'
import { useToast } from '../composables/useToast.ts'
import { isBase64String } from '../modules/db'
import { savePlant } from '../modules/plants'
import InputPhoto from './InputPhoto.vue'
import InputTextFloat from './InputTextFloat.vue'

interface Props {

}
interface Emits {
  back: []
}

interface FormData {
  strain: string
  name: string
  poppedAt: string
  image: string
}
interface FormData {
  strain: string
  name: string
  poppedAt: string
  image: string
}

interface Form extends FormData {
  error?: FormError<FormData>
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref<Form>({
  strain: '',
  name: '',
  poppedAt: '',
  image: '',
  error: {},
})

const loading = ref<boolean>(false)

const { showToast } = useToast()

function validateForm(): boolean {
  form.value.error = {}

  if (form.value.strain === '') {
    form.value.error.strain = 'Die Sorte muss angegeben werden!'
  }
  if (form.value.poppedAt === '') {
    form.value.error.poppedAt = 'Das Anpflanzungsdatum muss mit angegeben werden! Du kannst einfach schätzen falls du dir unsicher bist.'
  }
  if (!isBase64String(form.value.image)) {
    form.value.error.image = 'Bitte mache ein Bild von der Pflanze. Es kann später noch verändert werden!'
  }

  return Object.keys(form.value.error).length === 0
}

async function save() {
  loading.value = true

  if (!validateForm()) {
    showToast({
      message: 'Pflanze konnte nicht gespeichert werden.',
      variant: 'error',
      class: 'w-full sm:w-max',
      duration: 1500,
    })

    loading.value = false
    return
  }

  await savePlant(form.value)

  showToast({
    message: 'Pflanze erfolgreich gespeichert.',
    variant: 'success',
    class: 'w-full sm:w-max',
    duration: 1500,
  }, {
    close: () => emit('back'),
  })
}
</script>
