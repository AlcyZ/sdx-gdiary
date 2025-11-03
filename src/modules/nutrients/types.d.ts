import type { WithId } from '../../types'

interface NewFertilizer {
  name: string
  manufacturer?: string
}

type Fertilizer = WithId<NewFertilizer, number>
