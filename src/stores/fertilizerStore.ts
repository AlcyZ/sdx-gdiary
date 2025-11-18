import type { Fertilizer } from '../modules/nutrients/types'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { REPO_FERTILIZERS } from '../di_keys.ts'

export const useFertilizerStore = defineStore('fertilizer', () => {
  const fertilizerRepo = inject(REPO_FERTILIZERS)

  const fertilizers = ref<Array<Fertilizer>>([])

  const syncFertilizers = async () => fertilizers.value = await fertilizerRepo?.getAll() || []

  return {
    fertilizers,
    syncFertilizers,
  }
})
