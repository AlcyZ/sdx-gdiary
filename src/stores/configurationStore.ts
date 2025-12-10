import type ConfigurationRepository from '../modules/configuration/configuration_repository.ts'
import { defineStore } from 'pinia'
import { inject, ref } from 'vue'
import { REPO_CONFIG } from '../di_keys.ts'

export const useConfigurationStore = defineStore('configuration', () => {
  const configRepo = inject(REPO_CONFIG) as ConfigurationRepository

  const plantListingConfiguration = ref<PlantListingConfig>({
    filter: 'show-all',
  })

  const syncPlantListingConfiguration = () => {
    const opt = configRepo.getPlantListingConfig()
    if (opt.exist)
      plantListingConfiguration.value = opt.value
  }

  const savePlantListingConfiguration = (config: PlantListingConfig) => {
    configRepo.savePlantListingConfig(config)
    plantListingConfiguration.value = config
  }

  return {
    plantListingConfiguration,
    syncPlantListingConfiguration,
    savePlantListingConfiguration,
  }
})
