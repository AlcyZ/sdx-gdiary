<template>
  <div>
    overview ...
    <button @click="$emit('back')" class="btn btn-neutral">
      Back
    </button>
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
