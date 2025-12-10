export function isPlantListingFilter(value: any): value is PlantListingFilter {
  return value === 'show-all' || value === 'hide-harvested'
}

export function isPlantListingConfig(value: any): value is PlantListingConfig {
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return false
  }
  return 'filter' in value && isPlantListingFilter(value.filter)
}
