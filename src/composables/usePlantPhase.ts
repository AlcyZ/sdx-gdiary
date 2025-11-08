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

interface PhaseConfigColor {
  bg: string
  text: string
}

interface PhaseConfig {
  icon: Component
  label: string
  color: PhaseConfigColor
}

export const PHASE_CONFIG_MAP: Record<PlantPhaseType, PhaseConfig> = {
  'germination': {
    icon: IconGermination,
    label: 'Keimung',
    color: {
      bg: 'bg-gray-200',
      text: 'text-gray-800',
    },
  },
  'seedling': {
    icon: IconSeedling,
    label: 'Sämling',
    color: {
      bg: 'bg-green-100',
      text: 'text-green-800',
    },
  },
  'vegetation': {
    icon: IconVegetation,
    label: 'Vegi',
    color: {
      bg: 'bg-green-300',
      text: 'text-green-900',
    },
  },
  'pre-flower': {
    icon: IconPreFlower,
    label: 'Vorblüte',
    color: {
      bg: 'bg-yellow-200',
      text: 'text-yellow-900',
    },
  },
  'flower': {
    icon: IconFlower,
    label: 'Blüte',
    color: {
      bg: 'bg-pink-200',
      text: 'text-pink-900',
    },
  },
  'ripening': {
    icon: IconRipening,
    label: 'Reifung',
    color: {
      bg: 'bg-orange-300',
      text: 'text-orange-900',
    },
  },
  'harvest': {
    icon: IconHarvest,
    label: 'Ernte',
    color: {
      bg: 'bg-red-400',
      text: 'text-white', // Hoher Kontrast
    },
  },
  'drying': {
    icon: IconDrying,
    label: 'Trocknung',
    color: {
      bg: 'bg-amber-200',
      text: 'text-amber-900',
    },
  },
  'curing': {
    icon: IconCuring,
    label: 'Curing',
    color: {
      bg: 'bg-indigo-300',
      text: 'text-indigo-900',
    },
  },
}

export function usePlantPhase() {
  const getPhaseIcon = (phase: PlantPhaseType): Component => PHASE_CONFIG_MAP[phase].icon
  const getPhaseLabel = (phase: PlantPhaseType): string => PHASE_CONFIG_MAP[phase].label
  const getPhaseColor = (phase: PlantPhaseType): PhaseConfigColor => PHASE_CONFIG_MAP[phase].color

  return {
    getPhaseIcon,
    getPhaseLabel,
    getPhaseColor,
  }
}
