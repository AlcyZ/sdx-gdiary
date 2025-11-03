import type { Component } from 'vue'

/**
 * Represents a result type that can either hold a successful value of type `T` or an error value of type `E`.
 *
 * @template T - The type of the successful value.
 * @template E - The type of the error value.
 */
type Result<T, E> = Ok<T> | Err<E>

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

type Page = 'Home' | 'Pflanzen' | 'Nutrients'

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
  label: Page
  active?: boolean
}

interface ListItem {
  title: string
  text: string
  image: string
  actions: Array<ListItemAction>
}

interface DropdownItem {
  label: string
  icon: Component
  onClick?: () => void
}

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

type ResponsiveBreakpoint = 'sm' | 'md' | 'lg' | 'xl'

type FormError<T extends object> = {
  [K in keyof T]?: string
}

interface ShowConfirmationModalAction {
  label: string
  onClick: () => void
  class?: ComponentCssClass
  type?: 'button' | 'submit'
}

interface ShowConfirmationModalProps {
  title: string
  text?: string
  actions: Array<ShowConfirmationModalAction>
}
