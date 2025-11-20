import type { HasPlantId, PlantImage } from '../plants/types'

export type Column = '1'
  | '2'
  | '3'
  | '4'
  | '5'
  | '6'

export type Gap = '0'
  | '0.5'
  | '1'
  | '1.5'
  | '2'
  | '2.5'
  | '3'
  | '3.5'
  | '4'
  | '5'

interface HasNewIndex {
  newIndex: number
}
interface HasOldIndex {
  oldIndex: number
}

interface ChangeEventBase {
  element: PlantImage
}
export interface ChangeEventAdded {
  added: ChangeEventBase & HasNewIndex
}
export interface ChangeEventRemoved {
  removed: ChangeEventBase & HasOldIndex
}
export interface ChangeEventMoved {
  moved: ChangeEventBase & HasNewIndex & HasOldIndex
}
export type ChangeEvent = ChangeEventAdded | ChangeEventRemoved | ChangeEventMoved

export type ChangeAdded = HasPlantId & ChangeEventBase & HasNewIndex
export type ChangeRemoved = HasPlantId & ChangeEventBase & HasOldIndex

export interface ChangeAddedRemoved {
  added: ChangeAdded
  removed: ChangeRemoved
}
