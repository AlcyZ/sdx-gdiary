import type { StaggerOptions, VariantType } from 'motion-v'
import type { FromToAnimation } from '../types'
import { stagger } from 'motion-v'

interface StaggeredAnimation {
  list: Record<FromToAnimation, VariantType>
  item: Record<FromToAnimation, VariantType>
}

interface FromToStaggerOptions {
  from?: StaggerOptions
  to?: StaggerOptions
}

const toBaseOptions: StaggerOptions = {
  startDelay: 0.25,
}

function fadeX(from: number, opts?: FromToStaggerOptions): StaggeredAnimation {
  const fromOpts = { ...opts?.from }
  const toOpts = { ...toBaseOptions, ...opts?.to }

  return {
    list: {
      to: {
        opacity: 1,
        transition: {
          delayChildren: stagger(0.1, toOpts),
        },
      },
      from: {
        opacity: 0,
        transition: {
          delayChildren: stagger(0.2, fromOpts),
        },
      },
    },
    item: {
      to: { opacity: 1, x: 0 },
      from: { opacity: 0, x: from },
    },
  }
}

export default function useStaggerAnimation(opts?: FromToStaggerOptions) {
  return {
    fadeLeft: fadeX(-100, opts),
  }
}
