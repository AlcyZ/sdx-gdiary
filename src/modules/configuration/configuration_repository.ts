import type { Option, Result } from '../../types'
import ConfigurationReader from './repository/configuration_reader.ts'
import ConfigurationWriter from './repository/configuration_writer.ts'

export default class ConfigurationRepository {
  private readonly reader: ConfigurationReader
  private readonly writer: ConfigurationWriter

  constructor(reader: ConfigurationReader, writer: ConfigurationWriter) {
    this.reader = reader
    this.writer = writer
  }

  public static create() {
    const reader = ConfigurationReader.create()
    const writer = ConfigurationWriter.create()

    return new ConfigurationRepository(reader, writer)
  }

  public getPlantListingConfig(): Option<PlantListingConfig> {
    return this.reader.fetchPlantListingConfig()
  }

  public savePlantListingConfig(config: PlantListingConfig): Result<void, void> {
    return this.writer.storePlantListingConfig(config)
  }
}
