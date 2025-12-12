<template>
  <IEmptyState
    :title="title"
    :title-icon="IconNutrients"
    :illustration="IllustrationNutrients"
    :description="description"
    :cta="cta"
    :cta-icon="IconPlus"
    :to="{ name: 'nutrients.fertilizer.add' }"
  />
</template>

<script lang="ts" setup>
import {
  Apple as IconNutrients,
  Plus as IconPlus,
} from 'lucide-vue-next'
import IllustrationNutrients from '../illustrations/IllustrationNutrients.vue'
import IEmptyState from './ui/IEmptyState.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const title = 'Erfasse deine Nährstoffe'
const description = 'Bevor du Pflegeschemata erstellen kannst, musst du die Düngemittel (z.B. CalMag, Grow-Booster) erfassen, die du aktuell verwendest.'
const cta = 'Neuer Dünger erstellen'
</script>
