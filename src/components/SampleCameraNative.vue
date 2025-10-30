<template>
  <div>
    <div class="my-2">
      <h1 class="text-xl text-center">
        Native
      </h1>

      <p>Beispiel für die Verwendung der nativen Kamera.</p>
    </div>

    <div class="">
      <input
        id="cameraInput"
        type="file"
        accept="image/*"
        capture="environment"
        @change="foo"
      >

      <img ref="previewElement" alt="Captured photo will appear here">
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const previewElement = ref<HTMLImageElement | null>(null)

function foo(event: InputEvent) {
  if (event.target instanceof HTMLInputElement) {
    const file = event.target.files !== null && event.target.files[0]

    if (!file || !previewElement.value)
      return

    previewElement.value.src = URL.createObjectURL(file)
  }
}
</script>
