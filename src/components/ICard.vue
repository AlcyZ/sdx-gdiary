<template>
  <div class="card bg-base-100 shadow-sm">
    <div class="card-body">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
