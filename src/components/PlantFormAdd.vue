<template>
  <div class="flex items-center justify-center">
    <ICard
      class="w-full max-w-xl"
    >
      <div class="text-center mb-8">
        <h1 class="text-3xl font-bold">
          Neue Pflanze anlegen
        </h1>
      </div>

      <div class="space-y-3">
        <InputTextFloat
          v-model="strain"
          label="Wähle die Sorte deiner Pflanze aus"
          :error="errors.strain"
          required
        />

        <InputTextFloat
          v-model="name"
          label="Gib deiner Pflanze einen Namen (optional)"
          :error="errors.name"
        />

        <IFieldset
          legend="Substrat / Medium"
        >
          <IFloatingLabel
            label="Wähle das Substrat oder trage einen eigenen Typ ein"
          >
            <ISelect
              v-model="substrate"
              :options="substrates"
              class="w-full"
            >
              <template #option="{ item }">
                <option :value="item" :selected="item === substrate">
                  {{ item }}
                </option>
              </template>
            </ISelect>
          </IFloatingLabel>

          <InputTextFloat
            v-if="substrate === 'Custom'"
            v-model="customSubstrate"
            label="Eigener Substrattyp z.B. Steinwolle oder Spezialmischung"
            class="mt-2"
          />

          <InputTextFloat
            label="Gib die Größe des Topfes oder Volumens des Substrats an (z.B. 12L, 15cm x 15cm x 15cm)"
            type="text"
            class="mt-2"
            required
          />
        </IFieldset>
      </div>

      <button
        class="btn btn-primary"
        @click="submit"
      >
        Sub
      </button>
    </ICard>
  </div>
</template>

<script lang="ts" setup>
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { ref } from 'vue'
import * as yup from 'yup'
import ICard from './ICard.vue'
import IFieldset from './IFieldset.vue'
import IFloatingLabel from './IFloatingLabel.vue'
import InputTextFloat from './InputTextFloat.vue'
import ISelect from './ISelect.vue'

interface Props {

}
interface Emits {

}

defineProps<Props>()
defineEmits<Emits>()

type Substrate = 'Erde' | 'Coco' | 'Hydro' | 'Custom'
const substrates: Array<Substrate> = ['Erde', 'Coco', 'Hydro', 'Custom']
const substrate = ref('Erde')
const customSubstrate = ref('')

const ERR_STRAIN_REQUIRED = 'Die Sorte muss angegeben werden'
const ERR_STRAIN_MAX = ({ max }: { max: number }) => `Die Sorte dar maximal ${max} Zeichen lang sein`

const validationSchema = toTypedSchema(
  yup.object({
    strain: yup.string().required(ERR_STRAIN_REQUIRED).max(64, ERR_STRAIN_MAX),
    name: yup.string().optional(),
  }),
)

const { validate, errors, defineField } = useForm({
  validationSchema,
})

const [strain] = defineField('strain')
const [name] = defineField('name')

async function submit() {
  const result = await validate()

  console.info('[DEV.ValResult]', result)
}
</script>
