import type { Err, None, Ok, Some } from './types'

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
