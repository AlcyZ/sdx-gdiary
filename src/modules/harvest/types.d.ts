import type { WithPlantId } from '../plants/types'
import type {INDEX_PLANT_ID} from "../db";

type DryingState = 'wet' | 'semi_dry' | 'dry'

interface HarvestSession {
  type: 'session'
  state: DryingState
}

interface HarvestFinished {
  type: 'done'
}

type HarvestBase = WithPlantId<{
  timestamp: number
  weight?: number
  container?: string
  info?: string
}>
type HarvestLogRow = (HarvestSession | HarvestFinished) & HarvestBase

type Harvest = Omit<HarvestLogRow, typeof INDEX_PLANT_ID>

type NewHarvestBase = Omit<HarvestBase, 'id' | 'timestamp'> & {
  date: string
}
type NewHarvestSession = HarvestSession & NewHarvestBase
type NewHarvestFinished = HarvestFinished & NewHarvestBase

type NewHarvest = NewHarvestSession | NewHarvestFinished
