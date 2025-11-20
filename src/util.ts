import type { AsyncResult, Err, None, Ok, Option, ParseJsonError, Result, ResultOrOption, Some } from './types'

export function ok(): Ok<void>
export function ok<T>(value: T): Ok<T>
/**
 * Creates a successful result object with the given value.
 *
 * @param value - The value representing the successful result.
 * @returns {Ok} - A successful result object containing the provided value.
 * @template T - The type of the successful value.
 */
export function ok<T>(value?: T): Ok<T | void> {
  return value !== undefined
    ? { ok: true, value }
    : { ok: true, value: void 0 }
}

export function err(): Err<void>
export function err<E>(error: E): Err<E>
/**
 * Creates an error result object with the given error.
 *
 * @param error - The error representing the unsuccessful result.
 * @returns {Err} - An error result object containing the provided error.
 * @template E - The type of the error value.
 */
export function err<E>(error?: E): Err<E | void> {
  return error !== undefined
    ? { ok: false, error }
    : { ok: false, error: void 0 }
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

interface LogConfig {
  method?: string
  message: string
  payload?: any
  kind?: 'warn' | 'error'
}

function tryLog(log?: LogConfig, error?: unknown) {
  if (log === undefined)
    return

  const args: any[] = log.method ? [`[${log.method}]: ${log.message}`] : [log.message]
  if (error !== undefined)
    args.push(error)
  log.kind === 'error' ? console.error(...args) : console.warn(...args)
}

export function safeAsync<T, E = unknown>(
  run: () => Promise<T>,
  log?: LogConfig,
): AsyncResult<T, E> {
  return new Promise((resolve) => {
    const resolveErr = (error: E) => {
      tryLog(log, error)
      resolve(err(error))
    }
    try {
      run().then(result => resolve(ok(result))).catch(error => resolveErr(error as E))
    }
    catch (error: unknown) {
      resolveErr(error as E)
    }
  })
}

export function tryAsync<T>(
  run: () => Promise<T | undefined>,
  log?: LogConfig,
): Promise<Option<T>> {
  return new Promise<Option<T>>((resolve) => {
    const resolveNone = (error?: unknown) => {
      tryLog(log, error)
      resolve(none())
    }

    try {
      run()
        .then(result => result !== undefined ? resolve(some(result)) : resolveNone())
        .catch((error: unknown) => resolveNone(error))
    }
    catch (error: unknown) {
      resolveNone(error)
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

export function isResult<T, E = any>(value: ResultOrOption<T>): value is Result<T, E> {
  return 'ok' in value
}

export function unwrapOrUndefined<T>(value: ResultOrOption<T>): T | undefined {
  return isResult(value)
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

export function mapMimeToExtension(mime: string): string {
  switch (mime) {
    case 'image/jpeg':
      return '.jpg'
    case 'image/webp':
      return '.webp'
    case 'image/png':
    default:
      return '.png'
  }
}

export function mapExtensionToMime(extension: string): string {
  switch (extension) {
    case '.jpg':
      return 'image/jpeg'
    case '.png':
      return 'image/png'
    case '.webp':
      return 'image/webp'
    case '.gif':
      return 'image/gif'
    default:
      return 'application/octet-stream'
  }
}

export function getExtension(filename: string): Option<string> {
  const extension = filename.split('.')[1]

  return extension !== undefined ? some(`.${extension}`) : none()
}

export function safeParseJson<T>(content: string, guard: (value: any) => value is T): Result<T, ParseJsonError> {
  const result = wrapSafe(() => JSON.parse(content))

  if (!result.ok)
    return err({ kind: 'parse', error: result.error, payload: { content } })

  if (!guard(result.value))
    return err({ kind: 'guard', payload: { content } })

  return ok(result.value)
}

export function getEventTarget(event: Event): Option<HTMLInputElement> {
  return event.target instanceof HTMLInputElement ? some(event.target) : none()
}

export function getUploadedFiles(event: Event): Option<FileList> {
  return andThen(
    getEventTarget(event),
    target => target.files ? some(target.files) : none(),
  )
}

export function getUploadedFile(event: Event): Option<File> {
  return andThen(
    getUploadedFiles(event),
    files => files[0] instanceof File ? some(files[0]) : none(),
  )
}

export function wrapOption<T>(value: T | undefined | null): Option<T> {
  return value !== undefined && value !== null ? some(value) : none()
}

export function unwrapOr<T>(value: ResultOrOption<T>, or: T): T {
  return isResult(value)
    ? value.ok ? value.value : or
    : value.exist ? value.value : or
}

export function andThen<T, E, R, RE>(value: Result<T, E>, then: (value: T) => Result<R, RE>): Result<R, RE>
export function andThen<T, E, R>(value: Result<T, E>, then: (value: T) => Option<R>): Option<R>
export function andThen<T, R>(value: Option<T>, then: (value: T) => Option<R>): Option<R>
export function andThen<T, R, RE>(value: Option<T>, then: (value: T) => Result<R, RE>): Result<R, RE>

export function andThen<T, E, R, RE>(value: Result<T, E>, then: (value: T) => Promise<Result<R, RE>>): Promise<Result<R, RE>>
export function andThen<T, E, R>(value: Result<T, E>, then: (value: T) => Promise<Option<R>>): Promise<Option<R>>
export function andThen<T, R>(value: Option<T>, then: (value: T) => Promise<Option<R>>): Promise<Option<R>>
export function andThen<T, R, RE>(value: Option<T>, then: (value: T) => Promise<Result<R, RE>>): Promise<Result<R, RE>>
export function andThen<T, E, R>(
  value: ResultOrOption<T, E>,
  then: (value: T) => Promise<ResultOrOption<R, E>> | ResultOrOption<R, E>,
): Promise<ResultOrOption<R, E>> | ResultOrOption<R, E> {
  return isResult(value)
    ? value.ok ? then(value.value) : value
    : value.exist ? then(value.value) : value
}

export function doThen<T>(value: ResultOrOption<T>, then: (value: T) => any) {
  if (isResult(value)) {
    if (value.ok)
      then(value.value)
    return
  }

  if (value.exist)
    then(value.value)
}

export function toOpt<T>(result: Result<T, any>): Option<T> {
  return result.ok ? some(result.value) : none()
}

export function combineOpts<T, V>(lhs: Option<T>, rhs: Option<V>): Option<[T, V]> {
  return lhs.exist && rhs.exist
    ? some([lhs.value, rhs.value])
    : none()
}

export function omitKeys<T extends Record<string, any>, K extends keyof T>(
  obj: T,
  keysToOmit: K[],
): Omit<T, K> {
  const omittedKeys = new Set(keysToOmit)
  return Object.keys(obj).reduce((acc, key) => {
    if (!omittedKeys.has(key as K)) {
      acc[key as keyof Omit<T, K>] = obj[key]
    }

    return acc
  }, {} as Omit<T, K>)
}

type IdFrom<T extends object, IdType extends number | string> = {
  [K in keyof T]: T[K] extends IdType ? K : never
}[keyof T]

export function filterByIntersection<
  A extends object,
  B extends object,
  IdType extends number | string,
>(
  lhs: Array<A>,
  rhs: Array<B>,
  keyLhs: IdFrom<A, IdType>,
  keyRhs: IdFrom<B, IdType>,
): Array<A> {
  const referenceIds = new Set(rhs.map(item => item[keyRhs] as IdType))
  return lhs.filter((item) => {
    const id = item[keyLhs] as IdType
    return referenceIds.has(id)
  })
}

// export const PLANT_PLACEHOLDER_IMAGE = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQAlAMBIgACEQEDEQH/xAAbAAACAwEBAQAAAAAAAAAAAAAEBQADBgIHAf/EAD0QAAIBAwMCBQIEBAQEBwEAAAECAwAEEQUSITFBBhMiUWFxgRQyQpEVI6HRUmKxwTNDgvAkU3KSotLhB//EABkBAAMBAQEAAAAAAAAAAAAAAAABAwIEBf/EACQRAAICAgIBBAMBAAAAAAAAAAABAhEDMRIhQRMiI1EEMmFx/9oADAMBAAIRAxEAPwD0q3iby8SLg96puIgG46U3uVBBKmlTMC5Qms0Aov4wOVFDQesEHrTW4gGMnpVEcag5GKm4gLJoWD9KsjgyASKZyRhh0qRWxZWKlRtGeTS4oQALf4oW+i2JnGcmnKahYQymxlkHnyDKEYIAI68dO/Whr6AsCVjbYGIHehNPQ6FtrCWQEjiupbYZo23ACbcciuZEPtQ4iBY7YY7V8aDngUWgOK72/FLigKoIVVOe9cKv8zOKtd9pAqyNRgOadDLllESjI5oy2UznJHFLXO9hgZp7a7I4l+lUSAss9KiMqkDt1NPoYUhQKg4pLZ6gsMp352n2FEXOu28S/wAsMzfIrWgGualY+XUZpXLljz7VKVgMTK3bFCtZyyyFoh6u9Xqu44FNtOiCqxx36mmAgnidUKSDDUvEZjc5J+9anVLNpsNF+YDpSSS3ZiQw5FDQA6gkd6teKW4tZoFZYGeI4kxhh9CMVRcv+Fj3bWcg8KmMn6ZpPruug6ObfyXWdztjVu7HoGOOM/Ht1qM5LQGRhSR71LqW4R4bWPeHVh+QNnn44561tNC8Tadf2pgEyTFWJ2l8Mw/UTn2z1+leV6jqkjzyRPNGR5bRp5rH1Hcc5Hfk/WjPDNncXMy2inyDECC6jEbkjgEdev3BxUWmuxWevPDEyI9tExEuW3DnjP8AShioxSLwYkyxvdTXl0ZUh8jyGkKohXg4Hv8AWmgu7c3ZtxdQmcdYvNXd+wNWjNV2ASqD4r6ygL2r4Ae9fShcYzWxg5jDv24oq2tjcOI1OPpVkNluIGcA1o9K06O2AkPqkI6ntTSAR3GltZIJDlgepx0qsSjG0HAFau+QSWsikcYrMywoMkHNMD5F66puoSWoi1jAbOa6uU54ooAeO2ygOa+UTEQUFfKALXk8k4PWmOnajERskbBPQ0tkZZFJzmqYoiH68e1MDVnay5zlfikEufNfbzzVjFjHsDMB7A0NJb3U4MUEkduG48xhvbHwM/1pNgBX06Q/ndFcgkB3C5/7968/8bb9Ogi1aW5/HzyS/wAoJIVhhOO2OPbk81uNU0TTdKt5tQv7iWUqPVLK2Xc9gMYJJxwK8yvz+N1BNPmuLuRJ34hY4ROMjdjp9Ac5IrnndiZlrtBFeJdEssMsSSFSOctnuOetarRri4sUty0bmbG0q+CQeuck45HSllyLWbyJWHlwRbYbbzU9dwQf+Jt49BGOuPvR2v2mox3L21wrSWoKtPcGIIVBx+XOM9Ome1ZfudCNNpLpfJJNNcyzQFd4RZOfV1U4xuxnHOe9Oo/DmnXIEsdvGdo3N6s7fj4PwKReE4JLAyWt1eWfn7d1s8Umz8RG3IYL2P8AvTqy1BLC4n8wxvaP690bqdjjqrcDHYDJFYqKl7hjCG38lAiF9o6KWLY/fn+tE2yOzYCk1TBremXDhYrgYboWXA/fpT2wiicblZWHuGrqx8H+owZCYsbhyD3rRQzwtCsgkXbj3pLcQ5Yd6qWLFUAM1PU8o0cB9J4Le9J18yRx7GipE96+pgdqALI4QiE96HumIbgdqJTLHOa4kjyaAKIEPljJwa+UdHDhAAoqUUBjvCmpS30gQuXUcZrbrAFUE8cV4r4b1STTNQF0gb8P3jAzn6Ct+f8A+haetuJJbO7WLoZWiwormw5FxpiTsa6zrlvYWztHIrSL2rIaZ4nuV1UxrIHYkvsLfp+KzniDxJ+I3T2Lh4DJ6lK9RQ8LWvOtNClvHnZCGbhvct8CpZcjuws9fmns9TijuLyaOJF/4KykAA92wep9vb71594306IX0LaerTKykotvIN4YnsTwAe5zVsFrpZSG4v0k1jVJBujjYZjiXt6QCBnsKzOram1/fNBcQi2topN8iQ8S3BXA5x+ngAA/2FNT5is6urO20e3jJjg/iULKzKzeYh79D1xx2+9KNauZtSvHfWb8syMWiMinYXxkDA6AjjpRGv61Ck0KxxyKXQiaWYKzMM5CqCft+2Kpd49XnPnpFHGVXZJjguPfHPB4/frTSaVsC211u5sJYLrUHS4tIeVVE/4Q4/Icfv7nBrVCe11NF1LRniZ3O4kqTkdwRwQe3J/2rCuTczNaSxpCh9KtuHqfBHXseOhonTLabTL+Fo7oQmNS4Uk/zRyMbc/UH2OfiicU1/Q6PQdEt9V1ndcafcGDByn80gY+QSc+3GOnetLaXXiXS0DalapcwAepomBcft/akfgfVxEI0gjnNvMF2rhSVJJyPkdMY7H4OdpqupRWds0rIxx0BGDWY4Y1dtMEkgSfXIfwn4mPKjsHGPtWdHiwzSgBCAG5+BSPXvENvd27DaqlifSWOc++fesXbyXsLyTi4JjJ4BNPnKXVmrPfLC6gvowyHJwM0Q8UadwBWQ8GahLPYJIVRePehfGXieWwkjjiO1ic10KdRA3ax+nPau0QHgjNK/DupLe6ZFK7AllGeelFz3hVWFtsL/5jiqJ9WBXdataWspimk2sO2K+V5zreo6hLqMpl2hgcekZFSueWZphaM1pyGyYyCbeOo57U+8RX0s3hyCC22rE3qmnIwAPaslZMqoFiDyED1EniurjVbnUIDpcjrHbA8Ada48fciSkijSdRtZIprOdC5J/kiP8AWTTOL8bBL/E9UtfJsY/5drCRkFuwA9hyST/vWa8v8JOjCSPdE+V2/wC9ekrqEHiTR7fzMeTasjTnbjoOg+T0q86WzRaBaQaMpvxLcS3Ck+T5pReePURyQfbn6VkrsBrt7bTI4o3ALSy7doQfbOOuOnNNUu7vVruZo7ZkQN5VoM8F+5+gHU0PerJp9qYNNG3Mh33OPVM3QYJ6DJPTj71zR5OVPRlq2ZK9ukijnt7FmaUN/MmKnzHPx7L/AF55obFzFoluyNJ5M87FpGzyV4xn7Z+1GajasblWWQCV8srJjduz1NMYCtz4Pu4HIaSyvY2Ax6sPxn6Zz8/1rvuo9DfS6EH4y5tXNsxKIcEOqA7hgcHPXjA+1aN45ZpxFNk3MYxIY2GY34IZfnGMj3B+KS6vbAXGBKRmBNuc8MOT/qKB0qeUX0guZXEEymOWQ87c/q/fn96HHnFNbCr7PUvDF5pmmXn4nUhFDNNhCqnADAfnPTBznGO2PanWvXw1mHZY6krDbyI2yW+teVQ39/HJ/D9TCTGBvSZUDNxngN1IPbmmdtpc8irPY745CfTCTkH35JyPfv8AWubK5LqzLk9F9/p0tvDISjyNGTuIGcAdSazOpGXnyy52kHb0xWnt9RvIXEV/kSEYxMOCCezDkdPemLWtlervuIWicZyxyRyOBuBH/wAs1FZ/T/ZDU/BRpGv3VjpEDQEBuhX3qrVtTl1YAyw5Ye3eu7Twm91q8ES3XkW8nXPODj9jWt03wvp2mtJNqGoRzKjDZ+k/SnylPuDHTZR4M121jsvw0+VdBjrwaJ1XU4Y98kVsvP6yTVyeH9Ju2a4sSEZP0xtkOaXa4qWlm/mybXUcg1RzyR6NtNIx13carcXEkkMpVCeBUpZLrLrIwBwM1K1UmKx5d2Ftp4Edvd7t49R9qyWpeTHK4gkc8/mPU/Smf4zczRzsrBW9OPahrB7SbUpS6jf0iBPep4cco232TURVDp9zN6YM+rPWmujX13bCK1cuLZiyFEH5ie/yeKKsZ5b3W7mGwQFYoyidAqe7kmmybNMtYEt4VklAI/EtzljycewyCMdatkn1TG3Q6F1cRaPbxQoVkcZdVG8wx55XPdyACT1+KX6rJHrreVPFdRAt6I8qFzjjec549fGOAM0sv7t9ivdTsM4K7upH+Vf74oi3RJ5ZLJZXjY2jO5xlk3PGG6cbsNgDHGfrU8Ue7Yk7Yg1qBYXjuhOA05KW6YxuUHBf6HmjtEVjJcW86iL8dF5GF/LvX1xtjp+kr/1VfqNsNRja7jtHNtpd1nyAuAtuAgwD3/4Z5+aJ8cQx2Gn2V9YhUM1wJEKqf5ZHq5HPII+OvSuptPo1vozOqOt9e3K/iIkkVzGN5wMKcAH6Y61VDbG3KibyW3dGSQMoHuf7UBfAz309ysRAnlZggI4JPI/ei9JiiW4VZ8que2CVPvjvWuKiq8D0bC40r8R4ftLs7fNjyIpI33enj0kDnr09s/NfI/EupafLaqixSxBAPLAAZyO4OM56e+aljqE9kv8AKuo7QhQZRtIR357E4PTqOvvQuuTxX1i0txDHHyPLljGAjf4X7YPJBHtjtUJQTYq7s19y9jr9qslpFC1xI2TaG4VXxgcqeMGgtPgFpdy29zC5i/5tvLlZI19/8w/zLxSbwuk0F1bXscqSGIncyycMRjGSM5HJ689K093Fdaj67KVrG34PogSXDdzuRicZ9hUMuNaQ3Wy272aWY/KZtrFcIgYgn365U/SqdZuobyOEyREWyOPxDRjdNG+QM4zgg9+KUx6rJpy7NdEtzZRSem+szgp8Njt9QCPmgJvFii/iuoop2AY5jDqEZTx2Gf3rGPDJPlEaNd4f1HT7S+xbW5jZpgscmdr4P+IHj9qz/j+y1SLUpJrt8wTNuiYDjHtj3p7Z3GjanAb3TU33EDKNkq5ePJ/Lgnp9OPb2ovWJz5Cx3PlmJ87Qc7Qfg9voarJOht2jyB7VCxLDcc9SalX6pb/+PmzhPUfTu6V9qiT+zFC6afMm0Nye9BzxSQyhg3q6hs1LuEwqfUS2OadaZpM2r3kNqN6xmINcTKAfKTHU1ZVFX4GN9EhY2v4fTvMVZ8PcXDYVrhh1VTn0oOeepo6+ntNMRBtE1wgAjRukQHTAPcfWiZtTtLeCSPTzGsUJCbUON0g6EgcUpiAhuop711S5k9dtEWGSeoc/Ht81wOTySt6Jvt0cxW4HnajqEbSTAb0jk6fBI989M9u1deG5ZpG1bUJF3GOFVDn/ABls8ds5A/pXOsAWlntZy8s7GWV3OT7AD+tUy3CadoMGnOha6uGFzIkedwyPRn2O054HeqwfJWhLrQ80WTd59pdGWN7u1dUEibAMKSDluegPQd6Q6i8uoaLo9k1wkQgRyN7nk7uBj/8AK+eG3ul1uzcuxlSdGSBUMhYZ5yfpRfiKzi07VPLxlo0Iz8ZPGPrzW18boa6EsdkDiRZBnGF55Hxj3rmC1FteeXcMTCzFWc8FG9x98ZFEXytYWMV9cZEtwcWkLDGV/wDMPx0xRRtYbXwtc392++9uNsKIGAwSTxx2AGfvV4t7ZpAmnT31zYtbyW4kTqN8eUz78/3HWmVtp7EA234u3z+YRukkJ9/SxPvSu2SdrCVYrh1lt/5sS7iCoGNwB+ePvV2nXhvXWOSRoJT/AM9OOefzDof9eKnknJW4sUm0aGx097eUsLaOQO6gPDmEkE9xnHHXP9Ks1TWE0e4aGKZzcxviSJ2YqU68cD3+1CG8vtMbN8AyblUTxn0kn3qy80+11u2BgmWCdsGMjG3rz889OO9cnq2/k19iT+yWviKCe6ma4RTcTtsjRjgYPZsDkf60mk8MaheawILKyZI2bBIBwD8H2zxR2j+HpobgzIYm8ltrj8VnzOeQcdPvTuDV7VNQMWmboTKQBLcOfT3PUYA7e/NdEfa/ZopBOxBo8V5pBE99BcW4uwVWRQVaIYzluxGcUx1W6nhtYpry4by/yk4GAfmtVbays95/DLhJm8yNS8tox3wnGB9j1+cik2tzX1nNLHMJp7RHwDeQj1d8BWySMdxU8zbegn0IX0WG+xcqysHGcrnH+hqVfG2klc/gYlzyQjugz9Aa+1z+q1psjf8ATIXUSeU6Fwx65pzJey6LpcdjbxD+NXoHmYBLxIfyJ/6j1x2zzSjT7yG0cXZUSywjMURGQZOxb4HXHfArrQlmvdfjurozyuGaRpFBJdwMgE9smvUcVx92i5o2jgtoSbqSRrKyUIMgfznz+Xj379/mk9paXOp351O69KhsoAMKoHT6D4FbnUtD0y20SJNaikGJFkO2TAJPUg4x1GOe3HFWCx0+5tIpZZJILeNy2wptUr0Xnv0PHzXKnLja2zKg0rM9PbjUtSskJLRhFeVyQMIOSf7fUV34gsYRYNfmWQ3cs4LrsK8HIAyPYYAqjXZjaWe6EOhnCqCRsOxcMeO3JFS81Gc6dYz3DMQJlkQOD0UYHXryazjtJUZSoD0+8/hbMHJXUrhWCKOGhU+lQP8AMc5+mavMf8W1WWa8mkFpAgaeXbnAUdMn36feiNfZ7h7Gd47berjedoDlj3zSvVZvwOkRwukrNcv58g3dcHC/3z9KtL3NIH9FF/c/xXWIJmVUWOIukQwojUcKP2AqqYnUtQt7c58vOPT/AFqzTMwveTSIqM8ZWPcvq6/04orwvDu8Q24f8o3EkjI+/wAVqb4ul4Bvs5t7yKz1aOWaPbDucSDPVW6jjpVV1aDTtZmhB9BIeMq2QVbkc/Q0AwdHD7kJbOXPTr3/AHo2J/4lbJGuTeWqlVQDJaIZ798f6USh0OStGrgvPPtvMdGfC7JV25LL0z9hQEkTaPeRvGjnS5ziFy2Svvz79ftU8P343g7iGH5gD1rqZ4IL9tDu42FrOga2lkO7y29wfrXmKLUnElFWqHF959zp5kt8PcgbozGVyw7Z7+/FZSPVbe1vIXu7aSSaORvxCMdm5f8A7fT2+ae2ZfSmewvHi86MBkcH07OvXr+9KPFlrbW1wdQZWZbxMRgdm5yR9sfvVvxJ1L032vBWDfk0dpBatrlvJ4ev1uvwqB22YV2A5CbiPVxgH6VoLXVWuNMuEeKUPz6ZUJWM9QMkcffNeb6RJFZMZ7S5eKQorpsG1twPKnHuK1+n+IrrQ9MgN3NKYGYhJ2AbZnnDD9S/TBHaume6NsSvZaqjEeTnPPqBzz9MipRzeNdCWWUTaHLv3nJt58Rt8gfPWpXO8M70T4RPLfP23JdMFc9D3r1XwPYvBos0sglWC4IdYvRhsc7jnsOOvHPQ15PDDJLMsUSM8jHCoq5LH4HevYPD0N/Z+G521MbZHQs+45k3c44xgAADAz78V3fkp8aRUp1ua+vYZZ5pYYgY1RAHDhSCM8dRx3+tZa9v50eG1Ny4jwJCgPU59+nUfei2s7tJMLEs3lMqhSSQNxwefj0/vSme2UzXCBtyxyFVZAMrjjn+tYglXYNjnxFrzyvbBJY2DIvm5UBs5556gH4oPUdb3acsduygwSFg7KfzHPY9eDSSXzII/LKbucZHIP0NUwSQzuY5IyrHqzdPvW441FIyxjpk019dwmYHy4lZnbPAHeiNXvT5VneS4O8SNEpOQPUAM/THT4pS93PErxRGFo39J2HHHtXLBrq0t414EW8k/Uj+x/emoe62Zrst01mkvizytI0vpJznrWh8MIw1+IqFymc5PT6VkvUJB5AG5fbnHzmtloDg6pbTgLwxBIP6sYqP5Kr3ClsyuoMTmKSUFhIeQMd+M0GJpYZEuIXIkj/V0onU/Xc3BzuPmnoOOOtBl3jLBW7c8V1w0UNVYXEd+qS6dEIrpBmeIN+b/MBRXiK2XVNGF1ApNxZnLEHB2d/2NYe2uJbaZZ4GZHU5BFbXw9qkNywHlD1jFxDu6g9SK4s+J45LLHwZcalaL/D98+saekMrq1/Y+qN1PMidcH3qXskEsMmm3kyxwzfzbWcjAif/AAn2Has9fb/DXiM/htxhikDpu/XGex+3FNvFsUZS1vYmZrV1zGOpwe3/AH7Vl40sia1LRquxROr2zQ5Mik7i+xsFj2I+a1vhy2sdT042d3Ms0MuVgnZmSUN3jLf1APH9az2mW0F9p9xOZSstmwbY36kIPP713otu1nI/nFhBOAXXspz6cnt8NmumWv8ABM+Xehta3EkEMgdEYgeeQjrz0Ye/yOKlbO88OvqjR3Mkh3lAC3lht2O/KmpWbflioyHgDdb/AMU1CKR1mtLYSIAcBif8WOSPjOK3l48kcdpcSytcTS+svNg7SSq+nGAOGNSpSz/saYgsLy4vPGbQ3EheJriWPyz+XaAzDj3yoOazkR8i8d15LId27vzUqU4LwCKL1FeRBjbyUJUkZHzSgri4eIklRnGTUqV0ICqAsboR7iFZsHFM78+UionA4B+eKlSlPaMyOtRiS0trOOFcCYCSRu7dOPpTnw/Kxv8AHGAFKj/DyOn71KlS/IXxsbM9LzfyjsWfP/uNDhAb0Z7tgj7VKlUTNLZpfD2h2N9o9xLOjeYGIDA8iqGsIdPSOS2Lh/zbi3Oc1Klc0pPtFKQy8XW0d5pVjczZ81fTuHGRxxQWk/8AjvCWo29z6ktlEsJ7owYjg/SpUqWB/Av4ychLpUzolwqnh4gCP+oU60K4nju75UmcIY1Vk4KsD2IxUqV2z8mGO9Fupv4dFiRl68AkDrUqVK4nslZ//9k='
export const PLANT_PLACEHOLDER_IMAGE = 'data:image/png;base64,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'

// Kleiner, transparenter 1x1 GIF Base64 Placeholder (sehr leicht)
export const BASE64_PLACEHOLDER = 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
