import type { DryingState } from '../modules/harvest/types'
import { toTypedSchema } from '@vee-validate/yup'
import dayjs from 'dayjs'
import { useForm } from 'vee-validate'
import { computed } from 'vue'
import { boolean, number, object, string } from 'yup'

const ERR_DRYING_STATE_REQUIRED = 'Es muss ein Trocknungsstand angegeben werden'
const ERR_DATE_REQUIRED = 'Es muss ein Datum angegeben werden'

const harvestSchema = object({
  date: string().required(ERR_DATE_REQUIRED),
  weight: number().typeError('Es muss eine Zahl (dezimal) angegeben werden').optional(),
  container: string().optional(),
  info: string().optional(),

  isSessionForm: boolean().required(),

  state: string().when('isSessionForm', {
    is: true,
    then: s => s.required(ERR_DRYING_STATE_REQUIRED),
    otherwise: s => s.strip(),
  }),
})

const validationSchema = toTypedSchema(harvestSchema)

export function useHarvestForm() {
  const { defineField, errors, validate, resetForm } = useForm({
    validationSchema,
    initialValues: {
      date: dayjs().format('YYYY-MM-DDTHH:mm'),
      isSessionForm: true,
    },
  })

  const [date] = defineField<'date', string>('date')
  const [weight] = defineField<'weight', number | undefined>('weight')
  const [container] = defineField<'container', string | undefined>('container')
  const [info] = defineField<'info', string | undefined>('info')
  const [isSessionForm] = defineField<'isSessionForm', boolean>('isSessionForm')
  const [state] = defineField<'state', DryingState>('state')

  const hasFormErrors = computed(() => Object.keys(errors.value).length > 0)

  return {
    date,
    weight,
    container,
    info,
    isSessionForm,
    state,
    errors,
    hasFormErrors,
    validate,
    resetForm,
  }
}
