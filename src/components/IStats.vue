<template>
  <div class="stats" :class="vertical ? 'stats-vertical' : undefined">
    <slot />
  </div>
</template>

<script lang="ts" setup>
interface Props {
  vertical?: boolean
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
