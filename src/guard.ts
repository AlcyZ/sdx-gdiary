import type { HasContentNoLabel, HasContentOrLabel, HasLabelNoContent } from './types'
import { isVNode } from 'vue'

export function isHasLabelNoContent(value: any): value is HasLabelNoContent {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const hasLabel = 'label' in value && typeof value.label === 'string'
  const hasNoContent = !('content' in value) || value.content === undefined

  return hasLabel && hasNoContent
}

export function isHasContentNoLabel(value: any): value is HasContentNoLabel {
  if (typeof value !== 'object' || value === null) {
    return false
  }

  const hasVNode = isVNode(value.content)
  const hasNoLabel = !('label' in value) || value.label === undefined

  return hasVNode && hasNoLabel
}

export function isHasContentOrLabel(value: any): value is HasContentOrLabel {
  return isHasLabelNoContent(value) || isHasContentNoLabel(value)
}
