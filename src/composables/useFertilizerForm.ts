import type { NewFertilizer } from '../modules/nutrients/types'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import * as yup from 'yup'

const ERR_NAME_REQUIRED = 'Es muss ein Name angegeben werden'

export function useFertilizerForm(initialValues?: NewFertilizer) {
  const fertilizerSchema = yup.object({
    name: yup.string().required(ERR_NAME_REQUIRED),
    manufacturer: yup.string().optional(),
  })

  const validationSchema = toTypedSchema(fertilizerSchema)
  return useForm({
    validationSchema,
    initialValues,
  })
}
