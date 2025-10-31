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
            required
          />

          <InputTextFloat
            v-model="form.name"
            label="Wie heißt deine Pflanze?"
          />

          <InputTextFloat
            v-model="form.poppedAt"
            label="Wann ist sie eingepflanzt worden?"
            type="date"
          />

          <InputPhoto
            v-model="form.image"
            label="Füg ein Bild deiner Pflanze hinzu"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
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
  image: ''
}

defineProps<Props>()
defineEmits<Emits>()

const form = ref<FormData>({
  strain: '',
  name: '',
  poppedAt: '',
  image: '',
})
</script>
