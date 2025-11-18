<template>
  <component :is="containerTag" class="collapse" :class="collapseClass" v-bind="collapseAttrs">
    <input v-if="containerTag !== 'details'" type="radio" :name="name">
    <slot />
  </component>
</template>

<script lang="ts" setup>
import { computed } from 'vue'

interface Props {
  name: string
  arrow?: boolean
  plus?: boolean
  open?: boolean
  closable?: boolean
}
interface Emits {

}

const { name, arrow = false, plus = false, open = false, closable = false } = defineProps<Props>()
defineEmits<Emits>()

const collapseClass = computed(() => [
  arrow ? 'collapse-arrow' : undefined,
  plus ? 'collapse-plus' : undefined,
].filter(Boolean))

const collapseAttrs = computed(() => {
  const attrs: Record<string, string | boolean> = {}

  if (closable) {
    attrs.name = name
    if (open) {
      attrs.open = true
    }
  }

  return attrs
})

const containerTag = computed(() => closable ? 'details' : 'div')
</script>
