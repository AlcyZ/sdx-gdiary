<template>
  <div class="p-4">
    <button @click="startCamera" class="p-2 bg-green-600 text-white rounded">Kamera starten</button>
    <video ref="video" autoplay playsinline class="w-64 h-48 border mt-2" v-if="cameraStarted"></video>
    <img v-if="photoData" :src="photoData" class="w-64 h-48 border mt-2"/>

    <div class="mt-4 p-2 border bg-gray-100">
      <h3 class="font-bold">Fehler-Logs:</h3>
      <pre>{{ errorLogs.join('\n') }}</pre>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const video = ref(null)
const photoData = ref(null)
const cameraStarted = ref(false)
const errorLogs = ref([])

let originalConsoleError = console.error

// console.error überschreiben
console.error = function(...args) {
  errorLogs.value.push(args.map(a => (typeof a === 'object' ? JSON.stringify(a) : a)).join(' '))
  originalConsoleError.apply(console, args)
}

async function startCamera() {
  let asd = '1'
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    asd = '2'
    video.value.srcObject = stream
    asd = '3'
    cameraStarted.value = true
  } catch (err) {
    console.error('Kamera konnte nicht geöffnet werden: ' + asd + ':', err)
  }
}

function takePhoto() {
  try {
    const canvas = document.createElement('canvas')
    canvas.width = video.value.videoWidth
    canvas.height = video.value.videoHeight
    canvas.getContext('2d').drawImage(video.value, 0, 0)
    photoData.value = canvas.toDataURL('image/png')
  } catch (err) {
    console.error('Foto konnte nicht erstellt werden:', err)
  }
}
</script>
