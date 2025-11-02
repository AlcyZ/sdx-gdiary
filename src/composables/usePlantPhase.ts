import type { Component } from 'vue'
import type { PlantPhaseType } from '../modules/plants/types'
import {
  Archive as IconCuring,
  Wind as IconDrying,
  Flower as IconFlower,
  Sprout as IconGermination,
  Scissors as IconHarvest,
  Flower2 as IconPreFlower,
  Grape as IconRipening,
  Leaf as IconSeedling,
  Sun as IconVegetation,
} from 'lucide-vue-next'

const PHASE_ICON_MAP: Record<PlantPhaseType, {
  icon: Component
  label: string
}> = {
  'germination': {
    icon: IconGermination,
    label: 'Keimung',
  },
  'seedling': {
    icon: IconSeedling,
    label: 'Sämling',
  },
  'vegetation': {
    icon: IconVegetation,
    label: 'Vegetationsphase',
  },
  'pre-flower': {
    icon: IconPreFlower,
    label: 'Vorblüte',
  },
  'flower': {
    icon: IconFlower,
    label: 'Blütephase',
  },
  'ripening': {
    icon: IconRipening,
    label: 'Reifephase',
  },
  'harvest': {
    icon: IconHarvest,
    label: 'Ernte',
  },
  'drying': {
    icon: IconDrying,
    label: 'Trocknung',
  },
  'curing': {
    icon: IconCuring,
    label: 'Fermentierung',
  },
}

export function usePlantPhase() {
  const getPhaseIcon = (phase: PlantPhaseType): Component => PHASE_ICON_MAP[phase].icon
  const getPhaseLabel = (phase: PlantPhaseType): string => PHASE_ICON_MAP[phase].label

  return {
    getPhaseIcon,
    getPhaseLabel,
  }
}
