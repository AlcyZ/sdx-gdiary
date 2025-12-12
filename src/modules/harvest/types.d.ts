import type { WithId } from '../../types'
import type { INDEX_PLANT_ID } from '../db'
import type { WithPlantId } from '../plants/types'

type DryingState = 'wet' | 'semi_dry' | 'dry'

type HarvestSession = {
  type: 'session'
  state: DryingState
} & HarvestBase

type HarvestFinished = {
  type: 'done'
} & HarvestBase

interface HarvestBase {
  timestamp: number
  weight?: number
  container?: string
  info?: string
}

type HarvestLogRow = WithPlantId<HarvestSession | HarvestFinished>

type Harvest = WithId<HarvestSession | HarvestFinished, number>

type NewHarvestBase = Omit<HarvestBase, 'id' | 'timestamp' | typeof INDEX_PLANT_ID> & {
  date: string
}
type NewHarvestSession = Omit<HarvestSession, keyof HarvestBase> & NewHarvestBase
type NewHarvestFinished = Omit<HarvestFinished, keyof HarvestBase> & NewHarvestBase

type NewHarvest = NewHarvestSession | NewHarvestFinished
