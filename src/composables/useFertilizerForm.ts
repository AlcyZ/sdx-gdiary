import type { PartialDeep } from 'type-fest'
import type { InferType } from 'yup'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { object, string } from 'yup'

const ERR_NAME_REQUIRED = 'Es muss ein Name angegeben werden'

const fertilizerSchema = object({
  name: string().required(ERR_NAME_REQUIRED),
  manufacturer: string().optional(),
})

type FertilizerForm = InferType<typeof fertilizerSchema>

export function useFertilizerForm(initialValues?: PartialDeep<FertilizerForm>) {
  const validationSchema = toTypedSchema(fertilizerSchema)

  const { errors, defineField, validate, resetForm } = useForm({
    validationSchema,
    initialValues,
  })

  const [name] = defineField<'name', string>('name')
  const [manufacturer] = defineField<'manufacturer', string | undefined>('manufacturer')

  return {
    name,
    manufacturer,
    errors,
    validate,
    resetForm,
  }
}
