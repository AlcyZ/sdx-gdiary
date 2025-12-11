import type { Result } from '../../types'
import { err, ok } from '../../util.ts'

export function hasTimestamps(value: Record<string, unknown>): Result<void, GuardError> {
  if (!('createdAt' in value) || typeof value.createdAt !== 'string') {
    return err({ kind: 'has-timestamps', value })
  }
  if (!('updatedAt' in value) || typeof value.updatedAt !== 'string') {
    return err({ kind: 'has-timestamps', value })
  }
  return ok()
}

export function hasStrKey(value: Record<string, unknown>, key: string): Result<void, GuardError> {
  return key in value && typeof value[key] === 'string'
    ? ok()
    : err({ kind: 'has-str-key', value, key })
}

export function hasOptionalStrKey(value: Record<string, unknown>, key: string): Result<void, GuardError> {
  return key in value
    ? (typeof value[key] === 'string' || typeof value[key] === 'undefined'
        ? ok()
        : err({ kind: 'has-optional-str-key', value, key }))
    : ok()
}

export function hasOptionalNumKey(value: Record<string, unknown>, key: string): Result<void, GuardError> {
  return key in value
    ? (typeof value[key] === 'number' || typeof value[key] === 'undefined'
        ? ok()
        : err({ kind: 'has-optional-num-key', value, key }))
    : ok()
}

export function hasNumKey(value: Record<string, unknown>, key: string): Result<void, GuardError> {
  return key in value && typeof value[key] === 'number'
    ? ok()
    : err({ kind: 'has-num-key', value, key })
}

export function hasBoolKey(value: Record<string, unknown>, key: string): Result<void, GuardError> {
  return key in value && typeof value[key] === 'boolean'
    ? ok()
    : err({ kind: 'has-bool-key', value, key })
}

export function hasBlobKey(value: Record<string, unknown>, key: string): Result<void, GuardError> {
  return key in value && value[key] instanceof Blob
    ? ok()
    : err({ kind: 'has-blob-key', value, key })
}

export function isEmptyObject(value: unknown): boolean {
  return typeof value === 'object' && value !== null && Object.keys(value).length === 0
}

export function hasEmptyObjectKey(value: Record<string, unknown>, key: string): Result<void, GuardError> {
  return key in value && isEmptyObject(value[key])
    ? ok()
    : err({ kind: 'has-empty-object-key', value, key })
}
