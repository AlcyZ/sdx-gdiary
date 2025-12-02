import type { Component } from 'vue'

/**
 * Represents a result type that can either hold a successful value of type `T` or an error value of type `E`.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error value.
 */
type Result<T, E> = Ok<T> | Err<E>

type AsyncResult<T, E> = Promise<Result<T, E>>

/**
 * Represents a successful result value containing a value of type `T`.
 *
 * @template T - The type of the successful value.
 */
interface Ok<T> { ok: true, value: T }

/**
 * Represents an error result value containing an error value of type `E`.
 *
 * @template E - The type of the error value.
 */
interface Err<E> { ok: false, error: E }

interface Some<T> { exist: true, value: T }

interface None { exist: false }

type Option<T> = Some<T> | None

type ResultOrOption<T, E = any> = Result<T, E> | Option<T>

interface HasId<T> {
  id: T
}

type WithId<T, I> = T & HasId<I>

interface HasTimestamps {
  createdAt: string
  updatedAt: string
}

interface DockItem {
  icon: Component
  label: string
  to: string
}

interface ListItem {
  title: string
  text: string
  image: string
  actions: Array<ListItemAction>
}

interface DropdownItem {
  label: string
  icon?: Component
  onClick?: () => unknown
}

type DropdownPosition = 'start'
  | 'center'
  | 'end'
  | 'top'
  | 'bottom'
  | 'left'
  | 'right'

interface StepItem {

}

interface ListItemAction {
  icon: Component
  onClick?: () => void | Promise<void>
}

interface FabAction {
  icon: Component
  onClick?: () => unknown
}

interface TopNavigationAction {
  icon?: Component
  label: string
  onClick?: () => unknown
}

type ComponentCssClass = string | Record<string, boolean> | Array<ComponentCssClass>

interface ToastProps {
  message: string
  variant?: ToastVariant
  position?: ToastPosition
  duration?: number | undefined
  class?: ComponentCssClass
}
type ToastPosition = 'ts' | 'tc' | 'te' | 'ms' | 'mc' | 'me' | 'bs' | 'bc' | 'be'
type ToastVariant = 'info' | 'warning' | 'success' | 'error'

type BaseVariant = 'neutral' | 'primary' | 'secondary' | 'accent' | 'info' | 'success' | 'warning' | 'error'
type BaseSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

type StepVariant = BaseVariant

type BadgeVariant = BaseVariant
type BadgeSize = BaseSize

type ButtonVariant = BaseVariant
type ButtonSize = BaseSize

type InputSize = BaseSize
type SelectSize = BaseSize

type AlertVariant = Exclude<BaseVariant, 'neutral' | 'primary' | 'secondary' | 'accent'>

type LoadingSize = BaseSize
type LoadingType = 'spinner' | 'dots' | 'ring' | 'ball' | 'bars' | 'infinity'

type ResponsiveBreakpoint = 'sm' | 'md' | 'lg' | 'xl'

type FormError<T extends object> = {
  [K in keyof T]?: string
}

interface ShowConfirmationModalAction {
  label: string
  onClick: () => any
  class?: ComponentCssClass
  type?: 'button' | 'submit'
  icon?: Component
}

interface ShowConfirmationModalProps {
  title: string
  text?: string
  onEnter?: () => any
  actions: Array<ShowConfirmationModalAction>
}

interface ParseJsonErrorParse {
  kind: 'parse'
  error: unknown
}

interface ParseJsonErrorTypeGuard {
  kind: 'guard'
}

type ParseJsonError = (ParseJsonErrorParse | ParseJsonErrorTypeGuard) & {
  payload?: any
}
