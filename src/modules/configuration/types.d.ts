type PlantListingFilter = 'show-all'
  | 'hide-harvested'

interface PlantListingConfig {
  filter: PlantListingFilter
}
