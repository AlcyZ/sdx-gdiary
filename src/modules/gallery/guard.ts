import type { ChangeEvent, ChangeEventAdded, ChangeEventMoved, ChangeEventRemoved } from './types'

export const isAddedEvent = (event: ChangeEvent): event is ChangeEventAdded => 'added' in event
export const isRemovedEvent = (event: ChangeEvent): event is ChangeEventRemoved => 'removed' in event
export const isMovedEvent = (event: ChangeEvent): event is ChangeEventMoved => 'moved' in event
