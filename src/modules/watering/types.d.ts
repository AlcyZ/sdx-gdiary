import type { WithId } from '../../types'

interface WateringLogFertilizer {
  id?: number
  name: string
  manufacturer?: string
  amount: number
}

interface NewWateringLog {
  plantId: number
  date: number
  amount: number
  ph?: number
  ec?: number
  fertilizers: Array<WateringLogFertilizer>
}

type WateringLogRow = WithId<NewWateringLog, number>
type WateringLog = Omit<WateringLogRow, 'plantId'>
