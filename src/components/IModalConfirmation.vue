<template>
  <dialog ref="dialog" class="modal">
    <div class="modal-box">
      <h3 class="text-lg font-bold">
        {{ title }}
      </h3>
      <p v-if="text" class="py-4">
        {{ text }}
      </p>
      <div class="modal-action">
        <form method="dialog">
          <button class="btn">
            Schließen
          </button>
          <button
            v-for="(action, i) in actions"
            :key="i"
            class="btn ml-1"
            :class="action.class"
            :type="action.type || 'submit'"
            @click="action.onClick"
          >
            {{ action.label }}
          </button>
        </form>
      </div>
    </div>
    <form method="dialog" class="modal-backdrop">
      <button>close</button>
    </form>
  </dialog>
</template>

<script lang="ts" setup>
import type { ShowConfirmationModalAction } from '../types'
import { onMounted, ref } from 'vue'

interface Props {
  title: string
  text?: string
  actions: Array<ShowConfirmationModalAction>
}

interface Emits {
  close: []
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const dialog = ref<HTMLDialogElement | null>(null)

onMounted(() => {
  if (!dialog.value) {
    return
  }

  dialog.value.showModal()

  dialog.value.addEventListener('close', () => emit('close'))
})
</script>
