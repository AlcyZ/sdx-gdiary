import type { Ref } from 'vue'
import type {
  ChangeAdded,
  ChangeEvent,
  ChangeEventAdded,
  ChangeEventMoved,
  ChangeEventRemoved,
  ChangeRemoved,
} from '../modules/gallery/types'
import type { Plant } from '../modules/plants/types'
import { ref } from 'vue'
import { isAddedEvent, isMovedEvent, isRemovedEvent } from '../modules/gallery/guard.ts'

export function useGallerySortHandler(plants: Ref<Array<Plant>>) {
  const added = ref<ChangeAdded | undefined>()
  const removed = ref<ChangeRemoved | undefined>()

  function _assignAdded(event: ChangeEvent, plantId: number): void {
    if (isAddedEvent(event))
      added.value = { ...event.added, plantId }
  }

  function _assignRemoved(event: ChangeEvent, plantId: number): void {
    if (isRemovedEvent(event))
      removed.value = { ...event.removed, plantId }
  }

  function _assign(event: ChangeEvent, plantId: number): void {
    _assignAdded(event, plantId)
    _assignRemoved(event, plantId)
  }

  function _clear() {
    added.value = undefined
    removed.value = undefined
  }

  function _handleInList(event: ChangeEventMoved, plantId: number): void {
    _clear()

    const plant = plants.value.find(item => item.id === plantId)
    if (!plant)
      return

    const newImages = [...plant.images]

    const [image] = newImages.splice(event.moved.oldIndex, 1)
    if (!image)
      return

    newImages.splice(event.moved.newIndex, 0, image)
    plant.images = newImages
  }

  function _handleBetweenList(event: ChangeEventAdded | ChangeEventRemoved, plantId: number): void {
    _assign(event, plantId)

    if (!added.value || !removed.value) {
      return
    }

    const plantRemovedFrom = plants.value.find(plant => plant.id === removed.value?.plantId)
    if (plantRemovedFrom) {
      const newImages = [...plantRemovedFrom.images]
      newImages.splice(removed.value.oldIndex, 1)
      plantRemovedFrom.images = newImages
    }

    const plantAddedTo = plants.value.find(plant => plant.id === added.value?.plantId)
    if (plantAddedTo) {
      const newImages = [...plantAddedTo.images]
      newImages.splice(added.value.newIndex, 0, added.value.element)
      plantAddedTo.images = newImages
    }

    _clear()
  }

  function handle(event: ChangeEvent, plantId: number) {
    isMovedEvent(event)
      ? _handleInList(event, plantId)
      : _handleBetweenList(event, plantId)
  }

  return {
    handle,
  }
}
