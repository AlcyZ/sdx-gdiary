<template>
  <IModal
    close-on-click-outside
    class="modal-bottom sm:modal-middle"
  >
    <h2 class="text-xl font-semibold">
      Dünger hinzufügen
    </h2>

    <div>
      jetzt wird es SPANNEND!
    </div>

    <template #action>
      <IBtn
        @click="$emit('close')"
      >
        <IconClose />
        Schließen
      </IBtn>

      <IBtn
        variant="secondary"
        class="ml-1 text-base-100"
      >
        <IconPlus />
        Dünger hinzufügen
      </IBtn>
    </template>
  </IModal>
</template>

<script lang="ts" setup>
import {
  X as IconClose,
  Plus as IconPlus,
} from 'lucide-vue-next'
import IBtn from './IBtn.vue'
import IModal from './IModal.vue'

interface Props {
  foo: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
