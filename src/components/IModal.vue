<template>
  <dialog ref="dialog" class="modal">
    <div class="modal-box">
      <slot />

      <div class="modal-action">
        <slot name="action" />
      </div>
    </div>
    <form
      v-if="closeOnClickOutside"
      method="dialog" class="modal-backdrop"
    >
      <button>close</button>
    </form>
  </dialog>
</template>

<script lang="ts" setup>
import { onMounted, onUnmounted, ref } from 'vue'

interface Props {
  closeOnClickOutside?: boolean
}
interface Emits {
  close: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const dialog = ref<HTMLDialogElement | null>(null)

function emitClose() {
  emit('close')
}

onMounted(() => {
  dialog.value?.showModal()
  dialog.value?.addEventListener('close', emitClose)
})

onUnmounted(() => {
  dialog.value?.removeEventListener('close', emitClose)
})
</script>
