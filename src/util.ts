import type { Err, None, Ok, Option, ParseJsonError, Result, Some } from './types'

/**
 * Creates a successful result object with the given value.
 *
 * @param value - The value representing the successful result.
 * @returns {Ok} - A successful result object containing the provided value.
 * @template T - The type of the successful value.
 */
export function ok<T>(value: T): Ok<T> {
  return { ok: true, value }
}

/**
 * Creates an error result object with the given error.
 *
 * @param error - The error representing the unsuccessful result.
 * @returns {Err} - An error result object containing the provided error.
 * @template E - The type of the error value.
 */
export function err<E>(error: E): Err<E> {
  return { ok: false, error }
}

export function some<T>(value: T): Some<T> {
  return { exist: true, value }
}

export function none(): None {
  return { exist: false }
}

export function extractEventValue(event: Event): Option<string> {
  const extractFromTarget = (target: EventTarget | null): Option<string> => target === null
    ? none()
    : !('value' in target)
        ? none()
        : typeof target.value !== 'string'
          ? none()
          : some(target.value)

  return extractFromTarget(event.target)
}

export function now(): string {
  return new Date().toISOString().split('T')[0]!
}

export function typedKeys<T extends object>(obj: T): Array<keyof T> {
  return Object.keys(obj) as Array<keyof T>
}

export function removeArrayElement<T>(array: Array<T>, compare: (item: T) => boolean) {
  const index = array.findIndex(compare)
  if (index > -1) {
    array.splice(index, 1)
  }
}

export function wrapPromiseSafe(
  run: () => Promise<void>,
  errorLog?: {
    method?: string
    message?: string
    payload?: any
  },
): Promise<Result<undefined, unknown>> {
  const logError = (error: unknown) => {
    const prefix = errorLog?.method ? `[PlantWriteRepository.${errorLog.method}]` : '[PlantWriteRepository]'
    const message = errorLog?.message ? `${prefix} - ${errorLog.message}` : `${prefix} - Error:`
    console.error(message, errorLog?.payload, error)
  }

  return new Promise((resolve) => {
    try {
      run().then(() => resolve(ok(undefined))).catch((error) => {
        logError(error)
        resolve(err(error))
      })
    }
    catch (error: unknown) {
      logError(error)
      resolve(err(error))
    }
  })
}

export function wrapSafe<T>(
  run: () => any,
): Result<T, unknown> {
  try {
    const value = run()
    return ok(value)
  }
  catch (error: unknown) {
    return err(error)
  }
}

export function unwrapOrUndefined<T>(value: Result<T, unknown> | Option<T>): T | undefined {
  return 'ok' in value
    ? value.ok ? value.value : undefined
    : value.exist ? value.value : undefined
}

export function downloadJsonString(data: string, filename: string): void {
  const blob = new Blob([data], { type: 'application/json' })
  const url = URL.createObjectURL(blob)

  const a = document.createElement('a')
  a.href = url
  a.download = filename

  a.click()
  URL.revokeObjectURL(url)
}

export function safeParseJson<T>(content: string, guard: (value: any) => value is T): Result<T, ParseJsonError> {
  const result = wrapSafe(() => JSON.parse(content))

  if (!result.ok)
    return err({ kind: 'parse', error: result.error, payload: { content } })

  if (!guard(result.value))
    return err({ kind: 'guard', payload: { content } })

  return ok(result.value)
}

export const PLANT_PLACEHOLDER_IMAGE = 'data:image/jpeg;base64,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'
