<template>
  <div>
    <label class="floating-label">
      <input
        v-model.number="model"
        type="number"
        class="input"
        :class="inputClass"
      >
      <span>{{ label }}</span>
    </label>
    <div
      v-if="error"
      class="px-4 text-xs text-error flex items-center"
    >
      <XIcon
        :size="16"
      />
      <span>{{ error }}</span>
    </div>
    <div
      v-if="info"
      class="px-4 text-xs opacity-60"
    >
      {{ info }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import { XIcon } from 'lucide-vue-next'
import { computed } from 'vue'

interface Props {
  label: string
  error?: string
  info?: string
  fullWidth?: boolean
}
interface Emits {

}

const { fullWidth } = defineProps<Props>()
defineEmits<Emits>()

const model = defineModel<number>()

const inputClass = computed(() => fullWidth ? 'w-full' : undefined)
</script>
