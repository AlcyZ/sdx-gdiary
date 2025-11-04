import type { WithId } from '../../types'

interface NewFertilizer {
  name: string
  manufacturer?: string
}

type Fertilizer = WithId<NewFertilizer, number>

interface NewWateringSchemaFertilizer {
  fertilizer: Fertilizer
  amount: number
}

interface NewWateringSchema {
  name: string
  fertilizers: Array<NewWateringSchemaFertilizer>
}
