import type { Options, VariantType } from 'motion-v'

type SimpleAnimationStep = 'from' | 'to'

const baseTransition: Options['transition'] = {
  delay: 0.25,
}
const baseData: { transition: Options['transition'] } = {
  transition: baseTransition,
}

function fadeX(from: number): Record<SimpleAnimationStep, VariantType> {
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

function fadeY(from: number): Record<SimpleAnimationStep, VariantType> {
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

function scale(from: number): Record<SimpleAnimationStep, VariantType> {
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

const fadeUp: Record<SimpleAnimationStep, VariantType> = fadeY(20)
const fadeLeft: Record<SimpleAnimationStep, VariantType> = fadeX(50)

const scale075: Record<SimpleAnimationStep, VariantType> = scale(0.75)

export function useContentAnimation() {
  return {
    fadeUp,
    fadeLeft,
    scale075,
  }
}
