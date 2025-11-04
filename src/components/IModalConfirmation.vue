<template>
  <IModal close-on-click-outside>
    <h3 class="text-xl font-bold">
      {{ title }}
    </h3>
    <p v-if="text" class="py-4">
      {{ text }}
    </p>

    <template #action>
      <form method="dialog">
        <button class="btn">
          <IconBack />
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
          <component :is="action.icon" v-if="action.icon" />
          {{ action.label }}
        </button>
      </form>
    </template>
  </IModal>
</template>

<script lang="ts" setup>
import type { ShowConfirmationModalAction } from '../types'
import { ArrowBigLeft as IconBack } from 'lucide-vue-next'
import { onMounted, ref } from 'vue'
import IModal from './IModal.vue'

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
