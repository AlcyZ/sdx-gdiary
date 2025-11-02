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

const PHASE_ICON_MAP: Record<PlantPhaseType, Component> = {
  'germination': IconGermination,
  'seedling': IconSeedling,
  'vegetation': IconVegetation,
  'pre-flower': IconPreFlower,
  'flower': IconFlower,
  'ripening': IconRipening,
  'harvest': IconHarvest,
  'drying': IconDrying,
  'curing': IconCuring,
}

export function useIcon() {
  const getPhaseIcon = (phase: PlantPhaseType): Component => PHASE_ICON_MAP[phase]

  return {
    getPhaseIcon,
  }
}
