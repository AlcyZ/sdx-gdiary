import type { InferType } from 'yup'
import type { WateringSchema } from '../modules/nutrients/types'
import type { PlantContainerMedium } from '../modules/plant_container/types'
import type { NewPlantPhase, PlantPhaseType } from '../modules/plants/types'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { computed, ref } from 'vue'
import * as yup from 'yup'

const ERR_STRAIN_REQUIRED = 'Die Sorte muss angegeben werden'
const ERR_STRAIN_MAX = ({ max }: { max: number }) => `Die Sorte dar maximal ${max} Zeichen lang sein`

const ERR_CONTAINER_REQUIRED = 'Es muss ein Behälter ausgewählt werden'
const ERR_MEDIUM_REQUIRED = 'Es muss ein Medium ausgewählt werden'
const ERR_VOLUME_SIZE_REQUIRED = 'Es muss eine Substratgröße angegeben werden'
const ERR_PHASES_NOT_CHRONOLOGICALLY = 'Die Phasen müssen chronologisch aufeinander folgen'

const phaseSchema = yup.object({
  phase: yup.mixed<PlantPhaseType>().required(),
  startedAt: yup.string().required('Asd muss'),
  info: yup.string().optional(),
})

const plantSchema = yup.object({
  strain: yup.string().required(ERR_STRAIN_REQUIRED).max(64, ERR_STRAIN_MAX),
  name: yup.string().optional(),
  container: yup.string().required(ERR_CONTAINER_REQUIRED),
  medium: yup.string().required(ERR_MEDIUM_REQUIRED),
  volume: yup.number().required(ERR_VOLUME_SIZE_REQUIRED),
  notes: yup.string().optional(),
  phases: yup.array()
    .of(phaseSchema)
    .test('is-ascending', ERR_PHASES_NOT_CHRONOLOGICALLY, isChronologicallySorted),
})

const validationSchema = toTypedSchema(plantSchema)

export type PlantForm = InferType<typeof plantSchema>

function isChronologicallySorted(phases: Array<NewPlantPhase> | undefined): boolean {
  if (!phases || phases.length < 2) {
    return true
  }

  for (let i = 0; i < phases.length - 1; i++) {
    const current = phases[i]
    const next = phases[i + 1]

    if (!current?.startedAt || !next?.startedAt) {
      continue
    }

    const currentDate = new Date(current.startedAt)
    const nextDate = new Date(next.startedAt)

    if (Number.isNaN(currentDate.getTime()) || Number.isNaN(nextDate.getTime()))
      continue

    if (currentDate > nextDate)
      return false
  }

  return true
}

export function usePlantForm() {
  const { validate, errors, defineField, resetForm } = useForm({
    validationSchema,
    initialValues: {
      strain: '',
      name: '',
      container: '',
      medium: 'soil',
      volume: 0.5,
      notes: undefined,
      phases: [],
    },
  })

  const hasFormErrors = computed(() => Object.keys(errors.value).length > 0)

  const [strain] = defineField('strain')
  const [name] = defineField('name')
  const [container] = defineField<'container', string>('container')
  const [medium] = defineField<'medium', PlantContainerMedium>('medium')
  const [volume] = defineField<'volume', number>('volume')
  const [notes] = defineField<'notes', string>('notes')
  const [phases] = defineField<'phases', Array<NewPlantPhase>>('phases')

  const wateringSchema = ref<WateringSchema | undefined>()

  return {
    strain,
    name,
    container,
    medium,
    volume,
    notes,
    phases,
    wateringSchema,
    validate,
    errors,
    hasFormErrors,
    resetForm,
  }
}
