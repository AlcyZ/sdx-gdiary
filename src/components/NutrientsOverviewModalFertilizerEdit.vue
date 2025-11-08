<template>
  <IModal
    close-on-click-outside
    class="modal-bottom sm:modal-middle"
  >
    <h2 class="text-xl font-semibold">
      Dünger bearbeiten
    </h2>

    <form @submit.prevent="save">
      <FertilizerForm
        ref="form"
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
import type FertilizerForm from './FertilizerForm.vue'
import {
  X as IconClose,
  Save as IconSave,
} from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import { useFertilizerForm } from '../composables/useFertilizerForm.ts'
import IBtn from './ui/IBtn.vue'
import IModal from './ui/IModal.vue'

interface Props {
  fertilizer: Fertilizer
}
interface Emits {
  save: [data: NewFertilizer]
  close: []
}

const { fertilizer } = defineProps<Props>()
const emit = defineEmits<Emits>()

const form = ref<InstanceType<typeof FertilizerForm> | null>(null)

const { errors, defineField } = useFertilizerForm({
  name: fertilizer.name,
  manufacturer: fertilizer.manufacturer,
})

const [name] = defineField<'name', string>('name')
const [manufacturer] = defineField<'manufacturer', string>('manufacturer')

function save() {
  emit('save', { name: name.value, manufacturer: manufacturer.value })
}

/**
 * When opening the modal, the first input autofocus before layout stabilize, therefore the input might be
 * out of the viewport. Focus another input first to make sure autoscroll works properly!
 */
function workaroundFocusName() {
  form.value?.focusManufacturer()
  form.value?.focusName()
}

function applyInputNameFocusWorkaroundAfter(timeout: number = 250) {
  setTimeout(workaroundFocusName, timeout)
}

onMounted(applyInputNameFocusWorkaroundAfter)
</script>
