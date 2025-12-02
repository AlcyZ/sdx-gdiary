import type PlantRepository from '../modules/plants/plant_repository.ts'
import type { EditPlantContainer, NewPlantContainer, Plant, PlantImage, PlantImageSort } from '../modules/plants/types'
import { defineStore } from 'pinia'
import { computed, inject, ref } from 'vue'
import { useRoute } from 'vue-router'
import { REPO_PLANT } from '../di_keys.ts'
import { err } from '../util.ts'

export const usePlantStore = defineStore('plant', () => {
  const plantRepo = inject(REPO_PLANT) as PlantRepository

  const route = useRoute()

  const plant = ref<Plant | null>(null)
  const plants = ref<Array<Plant>>([])

  const hasPlants = computed(() => plants.value.length > 0)

  const syncPlant = async (plantId: number) => {
    const plantResult = await plantRepo?.getById(plantId) || err(undefined)
    if (plantResult.ok)
      plant.value = plantResult.value
  }
  const syncPlantWithRoute = async () => {
    const plantId = Number(route.params.plantId)
    if (Number.isNaN(plantId))
      return

    await syncPlant(plantId)
  }
  const syncPlants = async () => {
    plants.value = await plantRepo?.getAll() || []
  }

  const syncData = async () => await Promise.all([
    syncPlants(),
    syncPlantWithRoute(),
  ])

  const uploadPlantImage = async (file: File, sync: boolean = true) => {
    if (!plant.value)
      return err(undefined)

    const result = await plantRepo?.uploadPlantImage(plant.value, file) || err(undefined)
    if (result.ok && sync)
      await syncData()

    return result
  }

  const sortPlantImages = async (plants: Array<Plant>) => {
    const data: Array<PlantImageSort> = plants.map((plant): PlantImageSort => ({
      plantId: plant.id,
      images: plant.images.map(image => ({ id: image.id })),
    }))

    const result = await plantRepo.sortPlantImages(data)
    if (result.ok)
      await syncData()

    return result
  }

  const deleteWateringLog = async (logId: number) => {
    const result = await plantRepo.deleteWateringLog(logId)
    if (result.ok)
      await syncData()

    return result
  }

  const deleteContainer = async (containerId: number) => {
    const result = await plantRepo.deleteContainer(containerId)
    if (result.ok)
      await syncData()

    return result
  }

  const updateContainer = async (container: EditPlantContainer) => {
    if (!plant.value)
      return err()

    const result = await plantRepo.updateContainer(plant.value.id, container)
    if (result.ok)
      await syncData()

    return result
  }

  const markFavorit = async (image: PlantImage) => {
    if (!plant.value)
      return err(undefined)

    const result = await plantRepo?.markFavorit(plant.value, image) || err(undefined)
    if (result.ok)
      await syncData()

    return result
  }

  const addContainer = async (container: NewPlantContainer) => {
    if (!plant.value)
      return err(undefined)

    const result = await plantRepo.addContainer(plant.value.id, container)
    if (result.ok)
      await syncData()

    return result
  }

  return {
    plant,
    plants,
    hasPlants,
    syncPlant,
    syncPlantWithRoute,
    syncPlants,
    syncData,
    uploadPlantImage,
    sortPlantImages,
    markFavorit,
    addContainer,
    deleteWateringLog,
    deleteContainer,
    updateContainer,
  }
})
