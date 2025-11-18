import type { WithId } from '../../types'

interface NewFertilizer {
  name: string
  manufacturer?: string
}

type Fertilizer = WithId<NewFertilizer, number>

type FertilizerRow = Fertilizer

interface NewWateringSchemaFertilizer {
  fertilizer: Fertilizer
  amount: number
}

interface NewWateringSchema {
  name: string
  fertilizers: Array<NewWateringSchemaFertilizer>
}

type EditedWateringSchema = WithId<NewWateringSchema, number>

type WateringSchemaFertilizer = WithId<NewWateringSchemaFertilizer, number>

type WateringSchema = Omit<WithId<NewWateringSchema, number>, 'fertilizers'> & {
  fertilizers: Array<WateringSchemaFertilizer>
}

interface WateringSchemaRow {
  id: number
  name: string
  createdAt: number
  updatedAt: number
}

interface FertilizerWateringSchemaRow {
  id: number
  wateringSchemaId: number
  fertilizerId: number
  amount: number
}
