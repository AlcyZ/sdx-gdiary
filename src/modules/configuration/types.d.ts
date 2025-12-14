type PlantListingFilter = 'show-all'
  | 'show-harvested'
  | 'hide-harvested'

type PlantListingSort = 'default'
  | 'created-desc'
  | 'planted-asc'
  | 'planted-desc'

interface PlantListingConfig {
  filter: PlantListingFilter
  sort: PlantListingSort
}
