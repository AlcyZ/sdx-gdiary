import { CONFIG_PLANT_LISTING } from '../constants.ts'

export default class ConfigurationWriter {
  public static create() {
    return new ConfigurationWriter()
  }

  public storePlantListingConfig(config: PlantListingConfig) {
    const value = JSON.stringify(config)
    localStorage.setItem(CONFIG_PLANT_LISTING, value)
  }
}
