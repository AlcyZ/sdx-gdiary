<template>
  <div class="bg-emerald-950 text-neutral-200 w-screen h-screen text-2xl flex items-center justify-center text-center">
    <h1 v-if="isMobile">
      Um die App verwenden zu können, musst du sie auf deinen Home-Bildschrim installieren.
    </h1>

    <h1 v-else>
      Bitte verwende dein Mobiles Gerät.
    </h1>
  </div>
</template>

<script lang="ts" setup>
interface Props {
  isMobile: boolean
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
