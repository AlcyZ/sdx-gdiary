import type { Component } from 'vue'
import {
  TreeDeciduous as IconDry,
  Sun as IconSemiDry,
  Droplets as IconWet,
} from 'lucide-vue-next'

type DryingState = 'wet' | 'semi_dry' | 'dry'

const DRYING_STATE_INFO_MAP: Record<DryingState, {
  icon: Component
  label: string
}> = {
  wet: {
    label: 'Nass',
    icon: IconWet,
  },
  semi_dry: {
    label: 'Halbtrocken',
    icon: IconSemiDry,
  },
  dry: {
    label: 'Trocken',
    icon: IconDry,
  },
}

export function useHarvest() {
  const getDryingStateIcon = (state: DryingState): Component => DRYING_STATE_INFO_MAP[state].icon
  const getDryingStateLabel = (state: DryingState): string => DRYING_STATE_INFO_MAP[state].label

  return {
    getDryingStateIcon,
    getDryingStateLabel,
  }
}
