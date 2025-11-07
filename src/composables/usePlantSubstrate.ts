import type { Component } from 'vue'
import type { PlantSubstrateType } from '../modules/plants/types'
import {
  Palmtree as IconCoco,
  Wand2 as IconCustom,
  Droplets as IconHydro,
  Sprout as IconSoil,
} from 'lucide-vue-next'

const SUBSTRATE_ICON_MAP: Record<PlantSubstrateType, {
  icon: Component
  label: string
}> = {
  Erde: {
    label: 'Erde',
    icon: IconSoil,
  },
  Coco: {
    label: 'Coco',
    icon: IconCoco,
  },
  Hydro: {
    label: 'Hydro',
    icon: IconHydro,
  },
  Custom: {
    label: 'Custom',
    icon: IconCustom,
  },
}

export function usePlantSubstrate() {
  const strToSubstrate = (value: string): PlantSubstrateType =>
    value === 'Erde'
      ? 'Erde'
      : value === 'Coco'
        ? 'Coco'
        : value === 'Hydro'
          ? 'Hydro'
          : 'Custom'

  const getSubstrateIcon = (substrate: string): Component => SUBSTRATE_ICON_MAP[strToSubstrate(substrate)].icon
  const getSubstrateLabel = (substrate: string): string => SUBSTRATE_ICON_MAP[strToSubstrate(substrate)].label

  return {
    getSubstrateIcon,
    getSubstrateLabel,
  }
}
