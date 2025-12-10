import type { Option } from '../../../types'
import { none, safeParseJson, some } from '../../../util.ts'
import { CONFIG_PLANT_LISTING } from '../constants.ts'
import { isPlantListingConfig } from '../guard.ts'

export default class ConfigurationReader {
  public static create() {
    return new ConfigurationReader()
  }

  public fetchPlantListingConfig(): Option<PlantListingConfig> {
    const log = '[ConfigurationReader.fetchPlantListingConfig]:'

    const config = localStorage.getItem(CONFIG_PLANT_LISTING)
    if (!config) {
      console.warn(log, `Plant listing configuration (key: '${CONFIG_PLANT_LISTING}') not found`)
      return none()
    }

    const result = safeParseJson(config, isPlantListingConfig)
    if (!result.ok) {
      console.warn(log, 'Invalid plant listing configuration - config:', config, ' | error:', result.error)
      return none()
    }

    return some(result.value)
  }
}
