import type { InferType } from 'yup'
import type { Plant } from '../modules/plants/types'
import { toTypedSchema } from '@vee-validate/yup'
import dayjs from 'dayjs'
import { useForm } from 'vee-validate'
import { array, number, object, string } from 'yup'

const DEFAULT_AMOUNT = 1
const ERR_AMOUNT_REQUIRED = 'Es muss eine Menge angegeben werden'
const ERR_AMOUNT_TYPE = 'Es muss eine Zahl angegeben werden'

const fertilizerSchema = object({
  id: number().required(),
  name: string().required(),
  manufacturer: string().optional(),
})

const fertilizerDataSchema = object({
  fertilizer: fertilizerSchema,
  recommended: number().optional(),
  amount: number().required(ERR_AMOUNT_REQUIRED),
})

const pourSchema = object({
  date: string().required(),
  amount: number().typeError(ERR_AMOUNT_TYPE).required(ERR_AMOUNT_REQUIRED),
  ph: number().optional(),
  ec: number().optional(),
  fertilizers: array().of(fertilizerDataSchema),
})

export type FormFertilizerData = InferType<typeof fertilizerDataSchema>

const validationSchema = toTypedSchema(pourSchema)

export function usePouringForm(plant: Plant) {
  const { errors, defineField, validate } = useForm({
    validationSchema,
    initialValues: {
      date: dayjs().format('YYYY-MM-DDTHH:mm'),
      amount: DEFAULT_AMOUNT,
      fertilizers: plant.wateringSchema?.fertilizers
        .map((item): FormFertilizerData => ({
          fertilizer: item.fertilizer,
          recommended: item.amount,
          amount: item.amount * DEFAULT_AMOUNT,
        }))
        || [],
    },
  })

  const [date] = defineField<'date', string>('date')
  const [amount] = defineField<'amount', number>('amount')
  const [ph] = defineField('ph')
  const [ec] = defineField('ec')
  const [fertilizersData] = defineField<'fertilizers', Array<FormFertilizerData>>('fertilizers')

  return {
    date,
    amount,
    ph,
    ec,
    fertilizersData,
    errors,
    validate,
    DEFAULT_AMOUNT,
  }
}
