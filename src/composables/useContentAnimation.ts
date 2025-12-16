import type { Options, VariantType } from 'motion-v'
import type { FromToAnimation } from '../types'

const baseTransition: Options['transition'] = {
  delay: 0.25,
}
const baseData: { transition: Options['transition'] } = {
  transition: baseTransition,
}

function fadeX(from: number): Record<FromToAnimation, VariantType> {
  return {
    from: {
      opacity: 0,
      x: from,
    },
    to: {
      opacity: 1,
      x: 0,
      ...baseData,
    },
  }
}

function fadeY(from: number): Record<FromToAnimation, VariantType> {
  return {
    from: {
      opacity: 0,
      y: from,
    },
    to: {
      opacity: 1,
      y: 0,
      ...baseData,
    },
  }
}

function scale(from: number): Record<FromToAnimation, VariantType> {
  return {
    from: {
      opacity: 0,
      scale: from,
    },
    to: {
      opacity: 1,
      scale: 1,
      ...baseData,
    },
  }
}

const fadeUp: Record<FromToAnimation, VariantType> = fadeY(20)
const fadeLeft: Record<FromToAnimation, VariantType> = fadeX(50)

const scale075: Record<FromToAnimation, VariantType> = scale(0.75)

export function useContentAnimation() {
  return {
    fadeUp,
    fadeLeft,
    scale075,
  }
}
