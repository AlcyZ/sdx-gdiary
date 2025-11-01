<template>
  <fieldset class="fieldset bg-base-100 border-base-300 rounded-box border p-4">
    <legend class="fieldset-legend">{{ legend }}</legend>

    <slot />
  </fieldset>
</template>

<script lang="ts" setup>
interface Props {
  legend: string
}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
