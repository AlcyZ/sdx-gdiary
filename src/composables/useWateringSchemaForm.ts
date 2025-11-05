import type { PartialDeep } from 'type-fest'
import type { InferType } from 'yup'
import type { NewWateringSchemaFertilizer } from '../modules/nutrients/types'
import { toTypedSchema } from '@vee-validate/yup'
import { useForm } from 'vee-validate'
import { array, object, string } from 'yup'

const ERR_MSG_REQUIRED = 'Es muss ein Name für das Zuchtschema angegeben werden'
const ERR_DATA_REQUIRED = 'Es muss mindestens ein Dünger dem Schema zugewiesen werden'

const wateringSchemaSchema = object({
  name: string().required(ERR_MSG_REQUIRED),
  fertilizersData: array().required(ERR_DATA_REQUIRED).min(1, ERR_DATA_REQUIRED),
})
const validationSchema = toTypedSchema(wateringSchemaSchema)

export type WateringSchemaForm = InferType<typeof wateringSchemaSchema>

export function useWateringSchemaForm(initialValues?: PartialDeep<WateringSchemaForm>) {
  const { errors, defineField, validate } = useForm({
    validationSchema,
    initialValues,
  })

  const [name] = defineField('name')
  const [fertilizersData] = defineField<'fertilizersData', Array<NewWateringSchemaFertilizer>>('fertilizersData')

  return {
    name,
    fertilizersData,
    errors,
    validate,
  }
}
