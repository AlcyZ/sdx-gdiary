<template>
  <!-- Component: Plain basic input  -->
  <div class="relative my-6">
    <input
      :id="id"
      v-model="model"
      type="text"
      :name="id"
      :placeholder="placeholder"
      class="relative w-full h-10 px-4 text-sm placeholder-transparent transition-all border-b outline-none focus-visible:outline-none peer border-slate-200 text-slate-500 autofill:bg-white invalid:border-pink-500 invalid:text-pink-500 focus:border-emerald-500 focus:outline-none invalid:focus:border-pink-500 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-400"
      :maxlength="maxLength"
      :minlength="minLength"
    >
    <label
      :for="id"
      class="cursor-text peer-focus:cursor-default peer-autofill:-top-2 absolute left-2 -top-2 z-[1] px-2 text-xs text-slate-400 transition-all before:absolute before:top-0 before:left-0 before:z-[-1] before:block before:h-full before:w-full before:bg-white before:transition-all peer-placeholder-shown:top-2.5 peer-placeholder-shown:text-sm peer-required:after:text-pink-500 peer-required:after:content-['\00a0*'] peer-invalid:text-pink-500 peer-focus:-top-2 peer-focus:text-xs peer-focus:text-emerald-500 peer-invalid:peer-focus:text-pink-500 peer-disabled:cursor-not-allowed peer-disabled:text-slate-400 peer-disabled:before:bg-transparent"
    >
      {{ labelText }}
    </label>
  </div>
  <!-- End Plain basic input  -->
</template>

<script lang="ts" setup>
import { computed, useId } from 'vue'

interface Props {
  label: string
  helper?: string
  placeholder?: string
  minLength?: number
  maxLength?: number
  required?: boolean
}

interface Emits {

}

const { label, required = false, placeholder = '' } = defineProps<Props>()
defineEmits<Emits>()

const id = useId()

const model = defineModel({ required: true })

const labelText = computed(() => required ? `${label}*` : label)
</script>
