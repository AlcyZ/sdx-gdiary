<template>
  <div class="stat">
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  title?: string
  value?: string
  desc?: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
