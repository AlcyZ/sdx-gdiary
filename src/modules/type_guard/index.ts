export function hasTimestamps(value: any): boolean {
  return hasStrKey(value, 'createdAt')
    && hasStrKey(value, 'updatedAt')
}

export function hasStrKey(value: Record<string, unknown>, key: string): boolean {
  return key in value && typeof value[key] === 'string'
}

export function hasOptionalStrKey(value: Record<string, unknown>, key: string): boolean {
  return key in value
    ? typeof value[key] === 'string' || typeof value[key] === 'undefined'
    : true
}

export function hasOptionalNumKey(value: Record<string, unknown>, key: string): boolean {
  return key in value
    ? typeof value[key] === 'number' || typeof value[key] === 'undefined'
    : true
}

export function hasNumKey(value: Record<string, unknown>, key: string): boolean {
  return key in value && typeof value[key] === 'number'
}

export function hasBlobKey(value: Record<string, unknown>, key: string): boolean {
  return key in value && value[key] instanceof Blob
}
