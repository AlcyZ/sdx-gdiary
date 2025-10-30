<template>
  <div>
    <PlantForm />

    <LayoutNavigation />
  </div>
</template>

<script lang="ts" setup>
import PlantForm from '../components/Plant/PlantForm.vue'
import LayoutNavigation from "../components/LayoutNavigation.vue";

interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()
</script>
