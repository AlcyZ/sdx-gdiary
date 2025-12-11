interface ErrorBaseKey {
  value: Record<string, unknown>
  key: string
}

type ErrorStrKey = ErrorBaseKey & {
  kind: 'has-str-key'
}

type ErrorOptionalStrKey = ErrorBaseKey & {
  kind: 'has-optional-str-key'
}

type ErrorNumKey = ErrorBaseKey & {
  kind: 'has-num-key'
}

type ErrorOptionalNumKey = ErrorBaseKey & {
  kind: 'has-optional-num-key'
}

type ErrorBoolKey = ErrorBaseKey & {
  kind: 'has-bool-key'
}

type ErrorBlobKey = ErrorBaseKey & {
  kind: 'has-blob-key'
}

type ErrorEmptyObjectKey = ErrorBaseKey & {
  kind: 'has-empty-object-key'
}

interface ErrorTimestamps {
  value: Record<string, unknown>
  kind: 'has-timestamps'
}

type GuardError
  = | ErrorStrKey
    | ErrorOptionalStrKey
    | ErrorNumKey
    | ErrorOptionalNumKey
    | ErrorBoolKey
    | ErrorBlobKey
    | ErrorEmptyObjectKey
    | ErrorTimestamps
