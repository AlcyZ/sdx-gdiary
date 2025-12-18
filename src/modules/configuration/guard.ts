export function isPlantListingFilter(value: any): value is PlantListingFilter {
  return value === 'show-all' || value === 'show-harvested' || value === 'hide-harvested'
}

export function isPlantListingSort(value: any): value is PlantListingSort {
  return value === 'default'
    || value === 'created-desc'
    || value === 'planted-asc'
    || value === 'planted-desc'
    || value === 'watered-asc'
    || value === 'watered-desc'
}

export function isPlantListingConfig(value: any): value is PlantListingConfig {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }
  return isPlantListingFilter(value.filter)
    && isPlantListingSort(value.sort)
}
