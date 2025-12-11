type PlantListingFilter = 'show-all'
  | 'hide-harvested'

type PlantListingSort = 'default'
  | 'created-desc'
  | 'planted-asc'
  | 'planted-desc'

interface PlantListingConfig {
  filter: PlantListingFilter
  sort: PlantListingSort
}
