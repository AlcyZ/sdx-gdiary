import type { PlantPhaseType } from './types'

const PHASE_ORDER: Array<PlantPhaseType> = [
  'germination',
  'seedling',
  'vegetation',
  'pre-flower',
  'flower',
  'ripening',
  'harvest',
  'drying',
  'curing',
]

const phaseOrderMap = new Map<PlantPhaseType, number>()
PHASE_ORDER.forEach((phase, index) => {
  phaseOrderMap.set(phase, index)
})

export function sortPlantPhases(lhs: PlantPhaseType, rhs: PlantPhaseType): number {
  const a = phaseOrderMap.get(lhs) ?? Infinity
  const b = phaseOrderMap.get(rhs) ?? Infinity

  return a - b
}
