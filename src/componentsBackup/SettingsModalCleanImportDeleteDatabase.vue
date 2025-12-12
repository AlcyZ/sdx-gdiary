<template>
  <IModal
    class="modal-bottom sm:modal-middle"
    close-on-click-outside
  >
    <h3 class="text-2xl font-bold">
      Datenbank löschen
    </h3>

    <p class="my-6 text-sm text-gray-500">
      Für einen sauberen Import des Backups muss vorher die Datenbank gelöscht werden. Im Anschluss kann das Backup über
      den selben Button importiert werden.<br>
    </p>

    <IAlert
      variant="warning"
      soft
    >
      <IconAlert />

      <p>Die Aktion kann nicht rückgängig gemacht werden. Bitte mach ein Backup deiner Daten, bevor diese Funktion verwendet wird</p>
    </IAlert>

    <template #action>
      <IBtn
        @click="$emit('close')"
      >
        <IconBack />
        Zurück
      </IBtn>

      <IBtn
        variant="error"
        class="text-base-100"
        @click="$emit('submit')"
      >
        <IconDelete />
        Löschen
      </IBtn>
    </template>
  </IModal>
</template>

<script lang="ts" setup>
import {
  TriangleAlert as IconAlert,
  MoveLeft as IconBack,
  Trash as IconDelete,
} from 'lucide-vue-next'
import IAlert from './ui/IAlert.vue'
import IBtn from './ui/IBtn.vue'
import IModal from './ui/IModal.vue'

interface Props {

}

interface Emits {
  close: []
  submit: []
}

defineProps<Props>()
defineEmits<Emits>()
</script>
