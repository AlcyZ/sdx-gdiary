import type { Component } from 'vue'
import type { PlantContainerMedium } from '../modules/plant_container/types'
import {
  Palmtree as IconCoco,
  Wand2 as IconCustom,
  Droplets as IconHydro,
  BrickWallFire as IconRockwool,
  Sprout as IconSoil,
} from 'lucide-vue-next'

const MEDIUM_ICON_MAP: Record<PlantContainerMedium, {
  icon: Component
  label: string
}> = {
  soil: {
    label: 'Erde',
    icon: IconSoil,
  },
  coco: {
    label: 'Coco',
    icon: IconCoco,
  },
  hydro: {
    label: 'Hydro',
    icon: IconHydro,
  },
  rockwool: {
    label: 'Steinwolle',
    icon: IconRockwool,
  },
  custom: {
    label: 'Custom',
    icon: IconCustom,
  },
}

export function usePlantContainer() {
  const getMediumIcon = (medium: PlantContainerMedium): Component => MEDIUM_ICON_MAP[medium].icon
  const getMediumLabel = (medium: PlantContainerMedium): string => MEDIUM_ICON_MAP[medium].label

  return {
    getContainerIcon: getMediumIcon,
    getContainerLabel: getMediumLabel,
  }
}
