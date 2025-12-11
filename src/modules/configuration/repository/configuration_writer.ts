import type { Result } from '../../../types'
import { err, ok } from '../../../util.ts'
import { CONFIG_PLANT_LISTING } from '../constants.ts'
import { isPlantListingConfig } from '../guard.ts'

export default class ConfigurationWriter {
  public static create() {
    return new ConfigurationWriter()
  }

  public storePlantListingConfig(config: PlantListingConfig): Result<void, void> {
    if (!isPlantListingConfig(config))
      return err()

    const value = JSON.stringify(config)
    localStorage.setItem(CONFIG_PLANT_LISTING, value)

    return ok()
  }
}
