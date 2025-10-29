<template>
  <div>
    <p v-if="isMobile">
      Um die App verwenden zu können, musst du sie auf deinen Home-Bildschrim installieren.
    </p>

    <p v-else>
      Bitte verwende dein Mobiles Gerät.
    </p>
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

