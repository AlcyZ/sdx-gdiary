import type PlantRepository from '../modules/plants/plant_repository.ts'
import type { Plant } from '../modules/plants/types'
import type { WateringLog } from '../modules/watering/types'
import type { Option } from '../types'
import dayjs from 'dayjs'
import { inject } from 'vue'
import { REPO_PLANT } from '../di_keys.ts'
import { usePlantStore } from '../stores/plantStore.ts'
import { none, some } from '../util.ts'
import { useModal } from './useModal.ts'
import { useToast } from './useToast.ts'

export function usePlant() {
  const plantStore = usePlantStore()
  const plantRepo = inject(REPO_PLANT) as PlantRepository

  const { toast } = useToast()
  const { showConfirmationModal } = useModal()

  function getPlantName(plant: Plant) {
    return plant.name !== undefined && plant.name !== ''
      ? `${plant.name} (${plant.strain})`
      : plant.strain
  }

  function getPlantAge(plant: Plant): number {
    const startDateString = plant.phases.find(phase => phase.phase === 'germination')?.startedAt
      || dayjs().format('YYYY-MM-DDTHH:mm')

    const startDate = dayjs(startDateString)
    return dayjs().diff(startDate, 'days')
  }

  function getFlowerDay(plant: Plant): Option<number> {
    const flowerStart = plant.phases.find(phase => phase.phase === 'pre-flower')?.startedAt
    if (flowerStart === undefined)
      return none()

    const startDate = dayjs(flowerStart)
    const diff = dayjs().diff(startDate, 'days')

    return some(diff)
  }

  function getLastWatering(plant: Plant): Option<WateringLog> {
    if (plant.logs.watering.length === 0)
      return none()

    return some(
      plant.logs.watering.reduce(
        (lhs, rhs) => lhs.date > rhs.date ? lhs : rhs,
      ),
    )
  }

  function getLastWateringText(plant: Plant): string {
    const isNotWateredText = 'Neu'
    const today = 'Heute'

    const lastWatering = getLastWatering(plant)
    if (!lastWatering.exist)
      return isNotWateredText

    const lastWateringDate = dayjs(new Date(lastWatering.value.date))
    const daysPastSinceWatering = dayjs().diff(lastWateringDate, 'days')

    if (daysPastSinceWatering === 0)
      return today

    if (daysPastSinceWatering >= 10)
      return lastWateringDate.format('DD.MM.YYYY')

    return `vor ${daysPastSinceWatering} Tagen`
  }

  async function showDeleteConfirmationModal(plant: Plant, onDeleted?: () => any) {
    const plantName = plant.name !== undefined && plant.name !== ''
      ? `${plant.name} (${plant.strain})`
      : plant.strain
    const text = `Bist du sicher, dass die Pflanze '${plantName}' gelöscht werden soll? Diese Aktion kann nicht rückgängig gemacht werden.`

    const deleteAndSync = async () => {
      // Todo: Properly integrate in plant store
      const result = await plantRepo.delete(plant.id)

      if (result.ok) {
        toast(`${plantName} wurde erfolgreich gelöscht`, 'success')
        await plantStore.syncPlants()
        if (onDeleted)
          onDeleted()

        return
      }

      toast('Es ist ein Fehler beim löschen der Pflanze aufgetreten', 'error')
    }

    showConfirmationModal({
      title: 'Pflanze löschen',
      text,
      onEnter: async () => await deleteAndSync(),
      actions: [{
        label: 'Löschen',
        onClick: async () => await deleteAndSync(),
        class: 'btn-error text-base-100',
      }],
    })
  }

  return {
    getPlantName,
    getPlantAge,
    getFlowerDay,
    getLastWateringText,
    showDeleteConfirmationModal,
  }
}
