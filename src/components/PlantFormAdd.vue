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
            v-model="strain"
            label="Welche Sorte ist die Pflanze?"
            :error="errors.strain"
            required
          />

          <InputTextFloat
            v-model="name"
            label="Wie heißt deine Pflanze?"
            :error="errors?.name"
          />

          <InputTextFloat
            v-model="poppedAt"
            label="Wann ist sie eingepflanzt worden?"
            type="date"
            :error="errors?.poppedAt"
          />

          <InputPhoto
            v-model="image"
            label="Füg ein Bild deiner Pflanze hinzu"
            :error="errors?.image"
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
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as yup from 'yup'
import { useToast } from '../composables/useToast.ts'
import { isBase64String } from '../modules/db'
import { savePlant } from '../modules/plants'
import InputPhoto from './InputPhoto.vue'
import InputTextFloat from './InputTextFloat.vue'

interface Props {

}
interface Emits {
  back: []
  backAndSync: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const loading = ref<boolean>(false)

const { showToast } = useToast()

const imgError = 'Bitte mache ein Bild von der Pflanze. Es kann später noch verändert werden!'
const validationSchema = toTypedSchema(
  yup.object({
    strain: yup.string().required('Die Sorte muss angegeben werden!'),
    name: yup.string().optional(),
    poppedAt: yup.string().required('Das Anpflanzungsdatum muss mit angegeben werden! Du kannst einfach schätzen falls du dir unsicher bist.'),
    image: yup.string().required(imgError).test(
      'is-base-64-image',
      imgError,
      value => isBase64String(value || ''),
    ),
  }),
)
const { defineField, errors, validate } = useForm({
  validationSchema,
})

const [strain] = defineField('strain')
const [name] = defineField('name')
const [poppedAt] = defineField('poppedAt')
const [image] = defineField('image')

async function save() {
  loading.value = true

  const result = await validate()

  if (!result.valid || result.values === undefined) {
    showToast({
      message: 'Pflanze konnte nicht gespeichert werden.',
      variant: 'error',
      class: 'w-full sm:w-max',
      duration: 1500,
    })

    loading.value = false
    return
  }

  await savePlant({
    strain: strain.value || '',
    name: name.value,
    image: image.value || '',
    poppedAt: poppedAt.value || '',
  })

  showToast({
    message: 'Pflanze erfolgreich gespeichert.',
    variant: 'success',
    class: 'w-full sm:w-max',
    duration: 1500,
  }, {
    close: () => emit('backAndSync'),
  })
}
</script>
