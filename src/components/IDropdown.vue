<template>
  <!-- change popover-1 and --anchor-1 names. Use unique names for each dropdown -->
  <button
    class="btn"
    :popovertarget="id"
    style="anchor-name:--anchor-1"
  >
    Button
  </button>
  <ul
    :id="id"
    class="dropdown menu w-52 rounded-box bg-base-100 shadow-sm"
    popover
    style="position-anchor:--anchor-1"
  >
    <li><a>Item 1</a></li>
    <li><a>Item 2</a></li>
  </ul>
</template>

<script lang="ts" setup>
import { useId } from 'vue'

interface Props {

}

interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

const id = useId()
</script>
