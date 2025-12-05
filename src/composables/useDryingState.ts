import type { Component } from 'vue'
import type { DryingState } from '../modules/harvest/types'
import { Droplets, Gauge, Sun } from 'lucide-vue-next'

const DryingStateMap: Record<DryingState, { icon: Component, label: string }> = {
  wet: {
    icon: Droplets,
    label: 'Nass',
  },
  semi_dry: {
    icon: Gauge,
    label: 'Antrocknend',
  },
  dry: {
    icon: Sun,
    label: 'Trocken',
  },
}

export function useDryingState() {
  const getDryingStateIcon = (state: DryingState): Component => {
    return DryingStateMap[state].icon
  }

  const getDryingStateLabel = (state: DryingState): string => {
    return DryingStateMap[state].label
  }

  return {
    getDryingStateIcon,
    getDryingStateLabel,
  }
}
