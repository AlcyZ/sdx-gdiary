<template>
  <IModal>
    <h2 class="text-xl font-semibold">
      Dünger bearbeiten
    </h2>

    <form @submit.prevent="save">
      <InputFertilizer
        v-model:name="name"
        v-model:manufacturer="manufacturer"
        :error-name="errors.name"
        :error-manufacturer="errors.manufacturer"
        class="my-3"
      />
      <input type="submit" class="hidden">
    </form>

    <template #action>
      <IBtn
        @click="$emit('close')"
      >
        <IconClose />
        Schließen
      </IBtn>

      <IBtn
        variant="primary"
        class="ml-1 text-base-100"
        @click="save"
      >
        <IconSave />
        Speichern
      </IBtn>
    </template>
  </IModal>
</template>

<script lang="ts" setup>
import type { Fertilizer, NewFertilizer } from '../modules/nutrients/types'
import {
  X as IconClose,
  Save as IconSave,
} from 'lucide-vue-next'
import { useFertilizerForm } from '../composables/useFertilizerForm.ts'
import IBtn from './IBtn.vue'
import IModal from './IModal.vue'
import InputFertilizer from './InputFertilizer.vue'

interface Props {
  fertilizer: Fertilizer
}
interface Emits {
  save: [data: NewFertilizer]
  close: []
}

const { fertilizer } = defineProps<Props>()
const emit = defineEmits<Emits>()

const { errors, defineField } = useFertilizerForm({
  name: fertilizer.name,
  manufacturer: fertilizer.manufacturer,
})

const [name] = defineField<'name', string>('name')
const [manufacturer] = defineField<'manufacturer', string>('manufacturer')

function save() {
  emit('save', { name: name.value, manufacturer: manufacturer.value })
}
</script>
